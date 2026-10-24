import type { GoalId, LogItem, Product, Profile, ScoreResult, Sex, Verdict } from "@/lib/nara/types";
import { GOAL_LABEL } from "@/lib/nara/types";

export function dateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function recommendedTargets(input: {
  age: number;
  sex: Sex;
  heightCm: number;
  weightKg: number;
  goal: GoalId;
}) {
  const age = clamp(input.age, 16, 90);
  const heightCm = clamp(input.heightCm, 120, 230);
  const weightKg = clamp(input.weightKg, 35, 250);
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  const bmr =
    input.sex === "female" ? base - 161 : input.sex === "male" ? base + 5 : base - 78;
  const tdee = bmr * 1.45;
  const delta =
    input.goal === "lose" ? -450 : input.goal === "gain" ? 300 : input.goal === "cleaner" ? -200 : 0;
  const calories = Math.round(clamp(tdee + delta, 1400, 4200) / 10) * 10;
  const split = {
    lose: { p: 0.32, c: 0.38, f: 0.3 },
    maintain: { p: 0.25, c: 0.45, f: 0.3 },
    gain: { p: 0.28, c: 0.47, f: 0.25 },
    cleaner: { p: 0.28, c: 0.42, f: 0.3 },
  }[input.goal];
  return {
    calorieTarget: calories,
    proteinTarget: Math.round((calories * split.p) / 4),
    carbsTarget: Math.round((calories * split.c) / 4),
    fatTarget: Math.round((calories * split.f) / 9),
    sugarTarget: input.goal === "cleaner" ? 25 : input.goal === "lose" ? 35 : input.goal === "gain" ? 55 : 45,
    sodiumTarget: input.goal === "cleaner" ? 1800 : 2300,
    avoidUltra: input.goal !== "gain",
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
  };
}

export function emptyProfile(): Profile {
  return {
    age: 32,
    sex: "female",
    heightCm: 168,
    weightKg: 68,
    goal: "lose",
    calorieTarget: 1800,
    proteinTarget: 140,
    carbsTarget: 170,
    fatTarget: 60,
    sugarTarget: 35,
    sodiumTarget: 2300,
    avoidUltra: true,
    onboarded: false,
  };
}

export type Scaled = {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar: number;
  salt: number;
};

export function servingOf(product: Product, servings: number): Scaled {
  const base = product.perServing ?? {
    kcal: product.per100.kcal,
    protein: product.per100.protein,
    carbs: product.per100.carbs,
    fat: product.per100.fat,
    sugar: product.per100.sugar,
    salt: product.per100.salt,
  };
  const m = servings;
  return {
    kcal: round1(base.kcal * m),
    protein: round1(base.protein * m),
    carbs: round1(base.carbs * m),
    fat: round1(base.fat * m),
    sugar: round1(base.sugar * m),
    salt: round1(base.salt * m),
  };
}

export function logScaled(item: LogItem): Scaled {
  const m = item.servings;
  return {
    kcal: round1(item.base.calories * m),
    protein: round1(item.base.protein * m),
    carbs: round1(item.base.carbs * m),
    fat: round1(item.base.fat * m),
    sugar: round1(item.base.sugar * m),
    salt: 0,
  };
}

export function sumLogs(items: LogItem[]) {
  return items.reduce(
    (acc, item) => {
      const s = logScaled(item);
      acc.kcal += s.kcal;
      acc.protein += s.protein;
      acc.carbs += s.carbs;
      acc.fat += s.fat;
      acc.sugar += s.sugar;
      return acc;
    },
    { kcal: 0, protein: 0, carbs: 0, fat: 0, sugar: 0 },
  );
}

export function assessFit(args: {
  product: Product;
  score: ScoreResult;
  profile: Profile;
  eatenKcal: number;
  servings: number;
}): { verdict: Verdict; title: string; reasons: string[] } {
  const { product, score, profile, eatenKcal, servings } = args;
  const portion = servingOf(product, servings);
  const remaining = Math.max(0, profile.calorieTarget - eatenKcal);
  const budget = remaining > 0 ? remaining : profile.calorieTarget;
  const budgetLabel = remaining > 0 ? "left today" : "daily target";
  const kcalPct = budget > 0 ? Math.round((portion.kcal / budget) * 100) : 0;
  const sugarPct =
    profile.sugarTarget > 0 ? Math.round((portion.sugar / profile.sugarTarget) * 100) : 0;
  const reasons = [
    `${Math.round(portion.kcal)} kcal — ${kcalPct}% of what you have ${budgetLabel} (${Math.round(budget)} kcal).`,
  ];

  if (portion.sugar >= 1) {
    reasons.push(
      `${trim(portion.sugar)}g sugar — ${sugarPct}% of your ${profile.sugarTarget}g sugar budget.`,
    );
  }

  if (product.nova === 4 && profile.avoidUltra) {
    reasons.push("Ultra-processed. You asked Bitewise to flag these.");
  }

  const proteinLight =
    (profile.goal === "lose" || profile.goal === "gain") && portion.protein < 8 && portion.kcal > 90;
  if (proteinLight) reasons.push("Light on protein for this goal.");
  else if (portion.protein >= 12 && score.score >= 67) {
    reasons.push(`${trim(portion.protein)}g protein. That earns its place.`);
  }

  let verdict: Verdict = "fits";
  if (score.extreme || score.score < 34) verdict = "against";
  else if (sugarPct >= 50 || kcalPct >= 55) verdict = "against";
  else if (score.score < 67 || sugarPct >= 30 || kcalPct >= 35 || (product.nova === 4 && profile.avoidUltra)) {
    verdict = "tight";
  }

  if (verdict === "fits" && profile.goal === "cleaner" && product.nova === 4) verdict = "tight";

  const title =
    verdict === "fits"
      ? `Fits “${GOAL_LABEL[profile.goal].toLowerCase()}”`
      : verdict === "tight"
        ? "A tight fit today"
        : "Works against your goals";

  return { verdict, title, reasons: reasons.slice(0, 4) };
}

export function weekSeries(logs: LogItem[], today = new Date()) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const key = dateKey(d);
    const kcal = Math.round(sumLogs(logs.filter((item) => item.date === key)).kcal);
    days.push({
      key,
      label: d.toLocaleDateString(undefined, { weekday: "narrow" }),
      name: d.toLocaleDateString(undefined, { weekday: "short", day: "numeric" }),
      calories: kcal,
    });
  }
  return days;
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function trim(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
