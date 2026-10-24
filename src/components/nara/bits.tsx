import { useEffect, useState, type ReactNode } from "react";
import { bandClasses } from "@/lib/nara/scoring";
import type { Band } from "@/lib/nara/types";

export function Ring({
  value,
  max,
  band,
  children,
}: {
  value: number;
  max: number;
  band: Band;
  children: ReactNode;
}) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    setDrawn(false);
    const id = requestAnimationFrame(() => setDrawn(true));
    return () => cancelAnimationFrame(id);
  }, [value, max, band]);
  const ratio = drawn && max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  const tone = bandClasses(band);
  return (
    <div className="relative grid h-36 w-36 place-items-center">
      <svg viewBox="0 0 140 140" className="absolute h-36 w-36" aria-hidden="true">
        <circle cx="70" cy="70" r={r} fill="none" className="stroke-line" strokeWidth="10" />
        <circle
          cx="70"
          cy="70"
          r={r}
          fill="none"
          className={`score-arc ${tone.stroke}`}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - ratio)}
          transform="rotate(-90 70 70)"
        />
      </svg>
      <div className="relative text-center">{children}</div>
    </div>
  );
}

export function MacroBar({
  label,
  value,
  max,
  unit,
}: {
  label: string;
  value: number;
  max: number;
  unit: string;
}) {
  const over = value > max && max > 0;
  const width = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-sm">
        <span className="font-medium">{label}</span>
        <span className="tabular-nums text-muted">
          {Math.round(value)}
          <span className="text-muted">/{Math.round(max)}{unit}</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-line">
        <div
          className={`h-full rounded-full ${over ? "bg-clay" : "bg-fresh"}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export function Sheet({
  title,
  onClose,
  children,
  footer,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="scrim fixed inset-0 z-50 flex justify-center">
      <div className="sheet-in flex h-full w-full max-w-md flex-col bg-paper">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="font-sans text-base font-semibold tracking-tight">{title}</h2>
          <button type="button" className="press rounded-full px-3 py-2 text-sm font-medium text-muted" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-4">{children}</div>
        {footer ? <div className="tabbar-pad border-t border-line bg-paper px-4 pt-3">{footer}</div> : null}
      </div>
    </div>
  );
}

export function toneForVerdict(verdict: "fits" | "tight" | "against"): Band {
  if (verdict === "fits") return "green";
  if (verdict === "tight") return "orange";
  return "red";
}
