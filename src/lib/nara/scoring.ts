import { scoreAdditives } from "@/lib/nara/additives";
import type { Band, NutriGrade, Product, ScoreResult } from "@/lib/nara/types";

const GRADE_SCORE: Record<NutriGrade, number> = {
  a: 92,
  b: 75,
  c: 50,
  d: 28,
  e: 8,
};

const NOVA_SCORE = { 1: 100, 2: 78, 3: 48, 4: 18 } as const;

const NOVA_COPY = {
  1: "NOVA 1 — unprocessed or minimally processed.",
  2: "NOVA 2 — a culinary ingredient like oil, sugar or salt.",
  3: "NOVA 3 — processed. Real food, plus salt, oil or sugar.",
  4: "NOVA 4 — ultra-processed. An industrial recipe, not a kitchen one.",
} as const;

export function scoreProduct(product: Product): ScoreResult {
  const nutrition = nutritionScore(product);
  const processing = product.nova ? NOVA_SCORE[product.nova] : 55;
  const additive = scoreAdditives(product.additiveTags, product.ingredientFlags);
  const score = clamp(0.65 * nutrition.value + 0.2 * processing + 0.15 * additive.score);
  const sugarBomb = product.per100.sugar >= 15 || product.per100.satFat >= 8;
  const processed = product.nova === 3 || product.nova === 4;
  const extreme = score < 28 || (score < 40 && processed && sugarBomb);
  const band = scoreBand(score, extreme);
  const label = extreme
    ? "Extremely unhealthy"
    : score >= 80
      ? "Excellent"
      : score >= 67
        ? "Good"
        : score >= 50
          ? "Mediocre"
          : score >= 34
            ? "Poor"
            : "Bad";

  const flagged = additive.problems.filter((item) => item.level === "high" || item.level === "moderate");

  return {
    score,
    band,
    label,
    extreme,
    parts: {
      nutrition: nutrition.value,
      processing,
      additives: additive.score,
      nutritionDetail: nutrition.detail,
      processingDetail: product.nova
        ? NOVA_COPY[product.nova]
        : "Processing level isn't listed, so it isn't rewarded or punished.",
      additivesDetail:
        flagged.length === 0
          ? additive.unknown
            ? "Additives are listed, but none Bitewise treats as a red flag."
            : "No concerning additives listed."
          : `${flagged.length} ingredient${flagged.length === 1 ? "" : "s"} worth a second look.`,
    },
    problems: flagged.slice(0, 8),
  };
}

export function scoreBand(score: number, extreme = false): Band {
  if (extreme || score < 34) return "red";
  if (score < 67) return "orange";
  return "green";
}

function nutritionScore(product: Product): { value: number; detail: string } {
  if (product.nutriscore) {
    const grade = product.nutriscore.toUpperCase();
    return {
      value: GRADE_SCORE[product.nutriscore],
      detail: `Nutri-Score ${grade} — the label's own grade for nutrition per 100g.`,
    };
  }
  return {
    value: estimateNutrition(product),
    detail: "No Nutri-Score on file. Estimated from sugar, saturated fat, salt, fibre and protein per 100g.",
  };
}

function estimateNutrition(product: Product): number {
  const n = product.per100;
  let score = 48;
  if (n.sugar <= 5) score += 18;
  else if (n.sugar <= 10) score += 8;
  else if (n.sugar <= 15) score += 0;
  else if (n.sugar <= 22.5) score -= 16;
  else score -= 30;

  if (n.satFat <= 1.5) score += 12;
  else if (n.satFat <= 5) score -= 4;
  else score -= 18;

  if (n.salt <= 0.3) score += 10;
  else if (n.salt > 1.5) score -= 16;

  if (n.fiber >= 6) score += 12;
  else if (n.fiber >= 3) score += 6;

  if (n.protein >= 12) score += 10;
  else if (n.protein >= 6) score += 5;

  if (n.kcal >= 500) score -= 10;
  else if (n.kcal >= 400) score -= 4;

  return clamp(score);
}

function clamp(n: number) {
  return Math.max(0, Math.min(100, Math.round(n)));
}

export function bandClasses(band: Band): { text: string; bg: string; soft: string; stroke: string } {
  if (band === "green") {
    return {
      text: "text-forest",
      bg: "bg-fresh",
      soft: "bg-moss",
      stroke: "stroke-fresh",
    };
  }
  if (band === "orange") {
    return {
      text: "text-amber",
      bg: "bg-amber",
      soft: "bg-amber-soft",
      stroke: "stroke-amber",
    };
  }
  return {
    text: "text-clay",
    bg: "bg-clay",
    soft: "bg-clay-soft",
    stroke: "stroke-clay",
  };
}
