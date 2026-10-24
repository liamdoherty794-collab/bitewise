import { Minus, Plus, Trash2 } from "lucide-react";
import type { MealItem } from "@/lib/nara/types";

export function MealSheet({
  items,
  note,
  onChange,
  onClose,
  onSave,
}: {
  items: MealItem[];
  note: string;
  onChange: (items: MealItem[]) => void;
  onClose: () => void;
  onSave: () => void;
}) {
  const totals = items.reduce(
    (acc, item) => {
      acc.calories += item.calories * item.factor;
      acc.protein += item.protein * item.factor;
      acc.carbs += item.carbs * item.factor;
      acc.fat += item.fat * item.factor;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  function update(id: string, patch: Partial<MealItem>) {
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  function setMacro(item: MealItem, key: "calories" | "protein" | "carbs" | "fat", next: number) {
    const value = Number.isFinite(next) ? Math.max(0, next) : 0;
    update(item.id, {
      grams: item.grams * item.factor,
      calories: key === "calories" ? value : item.calories * item.factor,
      protein: key === "protein" ? value : item.protein * item.factor,
      carbs: key === "carbs" ? value : item.carbs * item.factor,
      fat: key === "fat" ? value : item.fat * item.factor,
      factor: 1,
    });
  }

  return (
    <div className="scrim fixed inset-0 z-40 flex justify-center">
      <div className="sheet-in flex h-full w-full max-w-md flex-col bg-paper">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="font-display text-3xl">This meal</h2>
          <button type="button" className="press rounded-full px-3 py-2 text-sm font-medium text-muted" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          <p className="text-sm text-muted">{note}</p>
          <div className="mt-4 grid grid-cols-4 gap-2 text-center">
            <Mini label="Kcal" value={String(Math.round(totals.calories))} />
            <Mini label="Protein" value={`${Math.round(totals.protein)}g`} />
            <Mini label="Carbs" value={`${Math.round(totals.carbs)}g`} />
            <Mini label="Fat" value={`${Math.round(totals.fat)}g`} />
          </div>
          <ul className="mt-4 space-y-3">
            {items.map((item) => (
              <li key={item.id} className="rounded-3xl border border-line bg-surface p-4">
                <div className="flex items-start gap-2">
                  <input
                    value={item.name}
                    onChange={(event) => update(item.id, { name: event.target.value })}
                    className="min-w-0 flex-1 bg-transparent font-semibold outline-none"
                    aria-label="Food name"
                  />
                  <button type="button" className="press text-muted" aria-label={`Remove ${item.name}`} onClick={() => onChange(items.filter((row) => row.id !== item.id))}>
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm text-muted">
                  {item.portion}
                  {item.grams ? ` · ${Math.round(item.grams * item.factor)}g` : ""}
                </p>
                <div className="mt-3 flex items-center gap-1 rounded-full bg-moss p-1">
                  <button
                    type="button"
                    className="press grid h-10 w-10 place-items-center"
                    aria-label="Smaller portion"
                    onClick={() => update(item.id, { factor: Math.max(0.25, round(item.factor - 0.25)) })}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-sm font-semibold tabular-nums">{item.factor}×</span>
                  <button
                    type="button"
                    className="press grid h-10 w-10 place-items-center"
                    aria-label="Larger portion"
                    onClick={() => update(item.id, { factor: Math.min(4, round(item.factor + 0.25)) })}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2">
                  <MacroField label="kcal" value={Math.round(item.calories * item.factor)} onChange={(next) => setMacro(item, "calories", next)} />
                  <MacroField label="protein" value={round1(item.protein * item.factor)} onChange={(next) => setMacro(item, "protein", next)} />
                  <MacroField label="carbs" value={round1(item.carbs * item.factor)} onChange={(next) => setMacro(item, "carbs", next)} />
                  <MacroField label="fat" value={round1(item.fat * item.factor)} onChange={(next) => setMacro(item, "fat", next)} />
                </div>
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="press mt-3 w-full rounded-2xl border border-dashed border-line py-3 text-sm font-medium text-muted"
            onClick={() =>
              onChange([
                ...items,
                {
                  id: Math.random().toString(36).slice(2, 8),
                  name: "Something else",
                  portion: "1 serving",
                  grams: 0,
                  calories: 100,
                  protein: 0,
                  carbs: 0,
                  fat: 0,
                  factor: 1,
                },
              ])
            }
          >
            Add a food
          </button>
        </div>
        <div className="tabbar-pad border-t border-line px-4 pt-3">
          <button
            type="button"
            className="press w-full rounded-full bg-fresh py-4 font-semibold text-[#222] disabled:opacity-40"
            disabled={!items.some((item) => item.name.trim())}
            onClick={onSave}
          >
            Save to today
          </button>
        </div>
      </div>
    </div>
  );
}

export function blankMeal(): MealItem[] {
  return [
    {
      id: "manual",
      name: "",
      portion: "your estimate",
      grams: 0,
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      factor: 1,
    },
  ];
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-moss px-1 py-3">
      <p className="text-xs text-muted">{label}</p>
      <p className="font-semibold tabular-nums">{value}</p>
    </div>
  );
}

function MacroField({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="text-xs text-muted">
      {label}
      <input
        inputMode="decimal"
        value={Number.isFinite(value) ? value : ""}
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-1 w-full rounded-xl bg-moss px-2 py-2 text-base font-semibold tabular-nums text-ink outline-none"
        aria-label={label}
      />
    </label>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}

function round(n: number) {
  return Math.round(n * 4) / 4;
}
