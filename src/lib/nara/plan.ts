export type PlanId = "free" | "pro";

/** Free is the whole app. Pro, later, only raises the meal-photo cap. */
const PHOTO_LIMIT: Record<PlanId, number> = {
  free: 3,
  pro: Number.POSITIVE_INFINITY,
};

export function currentPlan(): PlanId {
  try {
    return localStorage.getItem("bitewise-plan") === "pro" ? "pro" : "free";
  } catch {
    return "free";
  }
}

export function photoLimit(plan: PlanId = currentPlan()) {
  return PHOTO_LIMIT[plan];
}
