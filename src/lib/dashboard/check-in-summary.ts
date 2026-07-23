type CheckInForSummary = {
  status: "OPEN" | "MORNING_DONE" | "COMPLETED";
  sleepHours: unknown;
  energy: number | null;
  wellbeing: number | null;
};

export type CheckInSummary = {
  recordedDays: number;
  completedDays: number;
  averageSleepHours: number | null;
  averageEnergy: number | null;
  averageWellbeing: number | null;
};

function average(values: number[]): number | null {
  if (values.length === 0) {
    return null;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function summarizeCheckIns(
  entries: CheckInForSummary[],
): CheckInSummary {
  const sleepHours = entries.flatMap((entry) => {
    if (entry.sleepHours === null || entry.sleepHours === undefined) {
      return [];
    }

    const value = Number(entry.sleepHours);
    return Number.isFinite(value) ? [value] : [];
  });
  const energy = entries.flatMap((entry) =>
    entry.energy === null ? [] : [entry.energy],
  );
  const wellbeing = entries.flatMap((entry) =>
    entry.wellbeing === null ? [] : [entry.wellbeing],
  );

  return {
    recordedDays: entries.length,
    completedDays: entries.filter((entry) => entry.status === "COMPLETED")
      .length,
    averageSleepHours: average(sleepHours),
    averageEnergy: average(energy),
    averageWellbeing: average(wellbeing),
  };
}
