import { dateKey } from "@/lib/nara/goals";
import { currentPlan, photoLimit, type PlanId } from "@/lib/nara/plan";

const KEY = "bitewise-photo-scans";

type Recorded = { date: string; count: number };

export function photoScanStatus(): { plan: PlanId; limit: number; used: number; remaining: number | null } {
  const plan = currentPlan();
  const limit = photoLimit(plan);
  const used = scansToday();
  return {
    plan,
    limit,
    used,
    remaining: Number.isFinite(limit) ? Math.max(0, limit - used) : null,
  };
}

export function canScanPhoto() {
  const status = photoScanStatus();
  if (status.remaining === 0) {
    return {
      ok: false as const,
      message:
        "You've used today's 3 meal photos. Barcodes, search, and typing a meal still work. Photos reset tomorrow.",
    };
  }
  return { ok: true as const };
}

export function recordPhotoScan() {
  const next = { date: dateKey(), count: scansToday() + 1 };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
  return next.count;
}

function scansToday() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return 0;
    const parsed = JSON.parse(raw) as Partial<Recorded>;
    if (parsed.date !== dateKey()) return 0;
    const count = Number(parsed.count);
    return Number.isFinite(count) && count > 0 ? count : 0;
  } catch {
    return 0;
  }
}
