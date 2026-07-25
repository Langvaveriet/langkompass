export const supplementHistoryPeriods = ["7", "30", "90", "all"] as const;

export type SupplementHistoryPeriod = (typeof supplementHistoryPeriods)[number];

export const supplementHistoryPeriodLabels: Record<SupplementHistoryPeriod, string> = {
  "7": "7 Tage",
  "30": "30 Tage",
  "90": "90 Tage",
  all: "Gesamt",
};

type HistoryIntake = {
  takenAt: Date;
  tolerance: "NOT_RATED" | "WELL_TOLERATED" | "NEUTRAL" | "POSSIBLE_REACTION";
  effect: "NOT_RATED" | "POSITIVE" | "NEUTRAL" | "NEGATIVE" | "UNCLEAR";
};

export function summarizeSupplementIntakes(
  intakes: HistoryIntake[],
  dateKey: (date: Date) => string,
) {
  return {
    intakeCount: intakes.length,
    recordedDays: new Set(intakes.map(({ takenAt }) => dateKey(takenAt))).size,
    wellToleratedCount: intakes.filter(({ tolerance }) => tolerance === "WELL_TOLERATED").length,
    possibleReactionCount: intakes.filter(({ tolerance }) => tolerance === "POSSIBLE_REACTION").length,
    positiveEffectCount: intakes.filter(({ effect }) => effect === "POSITIVE").length,
  };
}

export function buildDailyIntakeCounts(
  intakes: Array<{ takenAt: Date }>,
  dateKeys: string[],
  dateKey: (date: Date) => string,
) {
  const counts = new Map(dateKeys.map((key) => [key, 0]));
  for (const intake of intakes) {
    const key = dateKey(intake.takenAt);
    if (counts.has(key)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return dateKeys.map((key) => ({ key, count: counts.get(key) ?? 0 }));
}
