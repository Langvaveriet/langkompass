type MealPlanStatus = {
  completedAt: Date | null;
};

export type MealPlanSummary = {
  plannedCount: number;
  completedCount: number;
  openCount: number;
};

export function summarizeMealPlan(
  entries: readonly MealPlanStatus[],
): MealPlanSummary {
  const completedCount = entries.filter(
    (entry) => entry.completedAt !== null,
  ).length;

  return {
    plannedCount: entries.length,
    completedCount,
    openCount: entries.length - completedCount,
  };
}
