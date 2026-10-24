import { useEffect, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { findAlternatives } from "@/lib/nara/api";
import { AISLE } from "@/lib/nara/catalog";
import { assessFit, servingOf } from "@/lib/nara/goals";
import { HEALTH_DISCLAIMER } from "@/lib/nara/copy";
import { bandClasses, scoreProduct } from "@/lib/nara/scoring";
import type { Product, Profile } from "@/lib/nara/types";
import { Ring, toneForVerdict } from "@/components/nara/bits";

export function ProductSheet({
  product,
  profile,
  eatenKcal,
  onClose,
  onOpen,
  onLog,
}: {
  product: Product;
  profile: Profile;
  eatenKcal: number;
  onClose: () => void;
  onOpen: (code: string) => void;
  onLog: (servings: number) => void;
}) {
  const [servings, setServings] = useState(1);
  const [added, setAdded] = useState(false);
  const [alts, setAlts] = useState<Product[]>([]);
  const score = scoreProduct(product);
  const tone = bandClasses(score.band);
  const portion = servingOf(product, servings);
  const fit = assessFit({ product, score, profile, eatenKcal, servings });
  const fitTone = bandClasses(toneForVerdict(fit.verdict));
  const unit = product.perServing ? product.servingSize : "100 g";

  useEffect(() => {
    let cancelled = false;
    setAlts([]);
    void findAlternatives({ data: { tags: product.categoryTags, exclude: product.code } }).then((result) => {
      if (cancelled) return;
      const ranked = pickAlternatives(product, score.score, result.products);
      setAlts(ranked);
    });
    return () => {
      cancelled = true;
    };
  }, [product, score.score]);

  return (
    <div className="scrim fixed inset-0 z-40 flex justify-center">
      <div className="sheet-in flex h-full w-full max-w-md flex-col bg-paper">
        <div className="flex items-center justify-between px-4 py-3">
          <p className="text-sm font-medium text-muted">
            {product.source === "open-food-facts" ? "Open Food Facts" : "Sample aisle"}
            {product.organic ? " · Organic" : ""}
          </p>
          <button type="button" className="press rounded-full px-3 py-2 text-sm font-medium text-muted" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-6">
          <div className="rise">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt=""
                className="mb-4 h-40 w-full rounded-3xl bg-moss object-contain"
              />
            ) : null}
            <p className="text-sm font-medium text-muted">{product.brand}</p>
            <h2 className="font-display text-4xl">{product.name}</h2>
            <p className="mt-1 text-sm text-muted">{product.category}</p>

            <div className={`mt-5 flex items-center gap-4 rounded-3xl px-3 py-4 ${tone.soft}`}>
              <Ring value={score.score} max={100} band={score.band}>
                <p className={`font-display text-4xl tabular-nums ${tone.text}`}>{score.score}</p>
                <p className="text-xs font-medium text-muted">/100</p>
              </Ring>
              <div>
                <p className={`font-display text-3xl ${tone.text}`}>{score.label}</p>
                <p className="mt-1 font-display text-4xl tabular-nums">{Math.round(portion.kcal)}</p>
                <p className="text-sm text-muted">kcal per {servings === 1 ? unit : `${servings} × ${unit}`}</p>
              </div>
            </div>

            {score.extreme ? (
              <p className="mt-3 rounded-2xl bg-clay-soft px-4 py-3 text-sm font-medium text-clay">
                Extremely unhealthy. The serving may not look huge, but the recipe is.
              </p>
            ) : null}

            <section className={`mt-3 rounded-3xl px-4 py-4 ${fitTone.soft}`}>
              <h3 className={`font-sans text-lg font-semibold ${fitTone.text}`}>{fit.title}</h3>
              <ul className="mt-2 space-y-1 text-sm">
                {fit.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </section>

            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <Mini label="Protein" value={`${trim(portion.protein)}g`} />
              <Mini label="Carbs" value={`${trim(portion.carbs)}g`} />
              <Mini label="Fat" value={`${trim(portion.fat)}g`} />
              <Mini label="Sugar" value={`${trim(portion.sugar)}g`} />
            </div>
            <p className="mt-2 text-center text-xs text-muted">
              Per 100g: {Math.round(product.per100.kcal)} kcal · {trim(product.per100.sugar)}g sugar ·{" "}
              {trim(product.per100.satFat)}g sat fat · {trim(product.per100.salt)}g salt
            </p>

            <section className="mt-6">
              <h3 className="font-sans text-sm font-semibold tracking-wide text-muted">WHY THIS SCORE</h3>
              <div className="mt-3 space-y-3">
                <Part label="Nutrition" value={score.parts.nutrition} detail={score.parts.nutritionDetail} />
                <Part label="Processing" value={score.parts.processing} detail={score.parts.processingDetail} />
                <Part label="Additives" value={score.parts.additives} detail={score.parts.additivesDetail} />
              </div>
            </section>

            <section className="mt-6">
              <h3 className="font-sans text-sm font-semibold tracking-wide text-muted">PROBLEM INGREDIENTS</h3>
              {score.problems.length === 0 ? (
                <p className="mt-2 text-sm text-muted">Nothing on this label that Bitewise treats as a problem.</p>
              ) : (
                <ul className="mt-3 space-y-3">
                  {score.problems.map((problem) => (
                    <li key={problem.name} className="rounded-2xl border border-line bg-surface px-4 py-3">
                      <p className="font-semibold">
                        {problem.name}
                        <span className={`ml-2 text-xs font-medium uppercase ${problem.level === "high" ? "text-clay" : "text-amber"}`}>
                          {problem.level}
                        </span>
                      </p>
                      <p className="mt-1 text-sm text-muted">{problem.why}</p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {product.ingredientsText ? (
              <details className="mt-4 rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
                <summary className="cursor-pointer font-medium">Full ingredient list</summary>
                <p className="mt-2 text-muted">{product.ingredientsText}</p>
              </details>
            ) : null}

            <section className="mt-6">
              <h3 className="font-sans text-sm font-semibold tracking-wide text-muted">BETTER IN THIS AISLE</h3>
              {alts.length === 0 ? (
                <p className="mt-2 text-sm text-muted">
                  {score.score >= 80
                    ? "This is already one of the better choices here."
                    : "No clearly better alternative turned up in this category."}
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {alts.map((item) => {
                    const altScore = scoreProduct(item);
                    const altTone = bandClasses(altScore.band);
                    return (
                      <li key={item.code}>
                        <button
                          type="button"
                          className="press flex w-full items-center justify-between gap-3 rounded-2xl border border-line bg-surface px-4 py-3 text-left"
                          onClick={() => onOpen(item.code)}
                        >
                          <span>
                            <span className="block font-semibold">{item.name}</span>
                            <span className="block text-sm text-muted">{item.brand}</span>
                          </span>
                          <span className={`font-display text-2xl tabular-nums ${altTone.text}`}>{altScore.score}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
            <p className="mt-6 text-xs text-muted">
              {HEALTH_DISCLAIMER} Barcode facts come from Open Food Facts when the code is in their database.
            </p>
          </div>
        </div>
        <div className="tabbar-pad border-t border-line bg-paper px-4 pt-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-moss p-1">
              <button type="button" className="press grid h-11 w-11 place-items-center" aria-label="Fewer servings" onClick={() => setServings((n) => Math.max(0.5, round(n - 0.5)))}>
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold tabular-nums">{servings}</span>
              <button type="button" className="press grid h-11 w-11 place-items-center" aria-label="More servings" onClick={() => setServings((n) => Math.min(6, round(n + 0.5)))}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              type="button"
              className="press flex-1 rounded-full bg-fresh py-3.5 font-semibold text-[#222]"
              onClick={() => {
                onLog(servings);
                setAdded(true);
              }}
            >
              {added ? "Added to today" : "Add to today"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function pickAlternatives(product: Product, current: number, remote: Product[]) {
  const seen = new Set<string>();
  const pool = [...remote, ...AISLE].filter((item) => {
    if (item.code === product.code || seen.has(item.code)) return false;
    seen.add(item.code);
    return related(item, product) && !sameFamily(item, product);
  });
  return pool
    .map((item) => ({ item, score: scoreProduct(item).score }))
    .filter((entry) => entry.score >= current + 8)
    .filter((entry) => product.per100.sugar < 8 || entry.item.per100.sugar <= product.per100.sugar * 0.7)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((entry) => entry.item);
}

function related(item: Product, product: Product) {
  if (item.categoryTags.some((tag) => product.categoryTags.includes(tag))) return true;
  const words = `${product.category} ${product.name}`
    .toLowerCase()
    .split(/[^a-z]+/)
    .filter((word) => word.length > 4 && !STOP.has(word));
  const blob = `${item.category} ${item.name} ${item.categoryTags.join(" ")}`.toLowerCase();
  return words.some((word) => blob.includes(word));
}

const STOP = new Set(["sample", "aisle", "plain", "chocolate", "sandwich", "white", "green", "black"]);

function sameFamily(item: Product, product: Product) {
  const a = item.name.toLowerCase();
  const b = product.name.toLowerCase();
  if (a.includes(b) || b.includes(a)) return true;
  const brandA = item.brand.toLowerCase();
  const brandB = product.brand.toLowerCase();
  if (brandA && brandB && brandA !== "aisle sample" && brandA === brandB) return true;
  return false;
}

function Part({ label, value, detail }: { label: string; value: number; detail: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted">{value}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-fresh" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-1 text-sm text-muted">{detail}</p>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-surface px-1 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function trim(n: number) {
  return Number.isInteger(n) ? String(n) : n.toFixed(1);
}

function round(n: number) {
  return Math.round(n * 10) / 10;
}
