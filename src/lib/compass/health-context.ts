export const healthContextSchemaVersion = "health-context.v1" as const;
export const healthContextPurpose = "GENERAL_OVERVIEW" as const;

type DailyEntryInput = {
  entryDate: Date;
  status: "OPEN" | "MORNING_DONE" | "COMPLETED";
  sleepHours: number | null;
  sleepQuality: number | null;
  energy: number | null;
  wellbeing: number | null;
  mood: number | null;
  hungerLevel: number | null;
  painLevel: number | null;
  stressLevel: number | null;
  waterLiters: number | null;
  steps: number | null;
  distanceKm: number | null;
  activeMinutes: number | null;
  symptomTags: string[];
  activityTags: string[];
  meals: Array<{
    energyKcal: number | null;
    category: string;
    traits: string[];
  }>;
};

export type HealthContextInput = {
  generatedAt: Date;
  periodStart: Date;
  periodEnd: Date;
  periodDays: number;
  trendSplitAt: Date;
  timeZone: string;
  profile: {
    heightCm: number | null;
    weightGoal: string | null;
    activityLevel: string | null;
    dietaryPatterns: string[];
    excludedFoodCategories: string[];
    avoidHistamine: boolean;
  } | null;
  dailyEntries: DailyEntryInput[];
  weights: Array<{ measuredAt: Date; valueKg: number }>;
  waistMeasurements: Array<{ measuredAt: Date; valueCm: number }>;
  trainingSessions: Array<{ completedAt: Date; setCount: number }>;
  labResults: Array<{
    analyteKey: string;
    analyteName: string;
    measuredAt: Date;
    value: number;
    unit: string;
    referenceLow: number | null;
    referenceHigh: number | null;
  }>;
  supplements: Array<{
    name: string;
    ingredients: string[];
  }>;
  supplementIntakes: Array<{
    takenAt: Date;
    tolerance: string;
    effect: string;
  }>;
};

type Frequency = { value: string; count: number };

function rounded(value: number, digits = 1): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function average(values: Array<number | null>): number | null {
  const available = values.filter((value): value is number => value !== null);
  if (available.length === 0) return null;
  return rounded(available.reduce((sum, value) => sum + value, 0) / available.length);
}

function comparison(
  entries: DailyEntryInput[],
  splitAt: Date,
  select: (entry: DailyEntryInput) => number | null,
) {
  const earlierAverage = average(
    entries.filter(({ entryDate }) => entryDate < splitAt).map(select),
  );
  const recentAverage = average(
    entries.filter(({ entryDate }) => entryDate >= splitAt).map(select),
  );
  if (earlierAverage === null || recentAverage === null) return null;
  return {
    earlierAverage,
    recentAverage,
    difference: rounded(recentAverage - earlierAverage),
  };
}

function frequencies(values: string[], limit = 8): Frequency[] {
  const counts = new Map<string, number>();
  for (const value of values) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts]
    .map(([value, count]) => ({ value, count }))
    .sort((left, right) => right.count - left.count || left.value.localeCompare(right.value))
    .slice(0, limit);
}

export function buildHealthContext(input: HealthContextInput) {
  const entries = [...input.dailyEntries].sort(
    (left, right) => left.entryDate.getTime() - right.entryDate.getTime(),
  );
  const weights = [...input.weights].sort(
    (left, right) => left.measuredAt.getTime() - right.measuredAt.getTime(),
  );
  const latestWeight = weights.at(-1)?.valueKg ?? null;
  const firstWeight = weights.at(0)?.valueKg ?? null;
  const waistMeasurements = [...input.waistMeasurements].sort(
    (left, right) => left.measuredAt.getTime() - right.measuredAt.getTime(),
  );
  const latestWaist = waistMeasurements.at(-1)?.valueCm ?? null;
  const firstWaist = waistMeasurements.at(0)?.valueCm ?? null;
  const mealItems = entries.flatMap(({ meals }) => meals);
  const knownMealEnergy = mealItems
    .map(({ energyKcal }) => energyKcal)
    .filter((value): value is number => value !== null);
  const latestLabs = new Map<string, HealthContextInput["labResults"][number]>();
  for (const result of [...input.labResults].sort(
    (left, right) => right.measuredAt.getTime() - left.measuredAt.getTime(),
  )) {
    if (!latestLabs.has(result.analyteKey)) latestLabs.set(result.analyteKey, result);
  }

  const dataGaps: string[] = [];
  if (entries.length === 0) dataGaps.push("Keine Tageserfassungen im betrachteten Zeitraum.");
  if (weights.length === 0) dataGaps.push("Keine Gewichtsmessungen im betrachteten Zeitraum.");
  if (mealItems.length === 0) dataGaps.push("Keine Mahlzeiten im betrachteten Zeitraum.");
  if (input.trainingSessions.length === 0) dataGaps.push("Keine abgeschlossenen Trainings im betrachteten Zeitraum.");
  if (latestLabs.size === 0) dataGaps.push("Keine Laborwerte vorhanden.");
  if (input.supplements.length === 0) dataGaps.push("Keine aktiven Supplemente dokumentiert.");

  return {
    schemaVersion: healthContextSchemaVersion,
    purpose: healthContextPurpose,
    generatedAt: input.generatedAt.toISOString(),
    period: {
      from: input.periodStart.toISOString(),
      toExclusive: input.periodEnd.toISOString(),
      days: input.periodDays,
      timeZone: input.timeZone,
    },
    privacy: {
      directIdentifiersIncluded: false,
      freeTextIncluded: false,
      externalTransmissionPerformed: false,
      excludedFields: [
        "Name und E-Mail-Adresse",
        "Notizen und Symptom-Freitext",
        "Arztkommentare und Labor-/Praxisnamen",
      ],
    },
    profile: input.profile,
    coverage: {
      dailyEntryCount: entries.length,
      completedDailyEntryCount: entries.filter(({ status }) => status === "COMPLETED").length,
      weightMeasurementCount: weights.length,
      recordedMealItemCount: mealItems.length,
      completedTrainingSessionCount: input.trainingSessions.length,
      latestLabAnalyteCount: latestLabs.size,
      activeSupplementCount: input.supplements.length,
      supplementIntakeCount: input.supplementIntakes.length,
    },
    observations: {
      dailyCheckIns: {
        averageSleepHours: average(entries.map(({ sleepHours }) => sleepHours)),
        averageSleepQuality: average(entries.map(({ sleepQuality }) => sleepQuality)),
        averageEnergy: average(entries.map(({ energy }) => energy)),
        averageWellbeing: average(entries.map(({ wellbeing }) => wellbeing)),
        averageMood: average(entries.map(({ mood }) => mood)),
        averageHungerLevel: average(entries.map(({ hungerLevel }) => hungerLevel)),
        averagePainLevel: average(entries.map(({ painLevel }) => painLevel)),
        averageStressLevel: average(entries.map(({ stressLevel }) => stressLevel)),
        averageWaterLiters: average(entries.map(({ waterLiters }) => waterLiters)),
        averageSteps: average(entries.map(({ steps }) => steps)),
        averageDistanceKm: average(entries.map(({ distanceKm }) => distanceKm)),
        averageActiveMinutes: average(entries.map(({ activeMinutes }) => activeMinutes)),
        frequentSymptomTags: frequencies(entries.flatMap(({ symptomTags }) => symptomTags)),
        frequentActivityTags: frequencies(entries.flatMap(({ activityTags }) => activityTags)),
        trends: {
          sleepHours: comparison(entries, input.trendSplitAt, ({ sleepHours }) => sleepHours),
          energy: comparison(entries, input.trendSplitAt, ({ energy }) => energy),
          wellbeing: comparison(entries, input.trendSplitAt, ({ wellbeing }) => wellbeing),
          mood: comparison(entries, input.trendSplitAt, ({ mood }) => mood),
          steps: comparison(entries, input.trendSplitAt, ({ steps }) => steps),
        },
      },
      body: {
        latestWeightKg: latestWeight === null ? null : rounded(latestWeight, 2),
        weightChangeKg: latestWeight === null || firstWeight === null
          ? null
          : rounded(latestWeight - firstWeight, 2),
        latestWaistCm: latestWaist === null ? null : rounded(latestWaist, 2),
        waistChangeCm: latestWaist === null || firstWaist === null
          ? null
          : rounded(latestWaist - firstWaist, 2),
      },
      nutrition: {
        recordedMealItemCount: mealItems.length,
        estimatedEnergyKcal: knownMealEnergy.length === 0
          ? null
          : Math.round(knownMealEnergy.reduce((sum, value) => sum + value, 0)),
        foodCategories: frequencies(mealItems.map(({ category }) => category)),
        foodTraits: frequencies(mealItems.flatMap(({ traits }) => traits)),
      },
      training: {
        completedSessionCount: input.trainingSessions.length,
        documentedSetCount: input.trainingSessions.reduce(
          (sum, session) => sum + session.setCount,
          0,
        ),
      },
      laboratory: {
        latestResults: [...latestLabs.values()]
          .sort((left, right) => left.analyteName.localeCompare(right.analyteName))
          .map((result) => ({
            analyteKey: result.analyteKey,
            analyteName: result.analyteName,
            measuredAt: result.measuredAt.toISOString(),
            value: result.value,
            unit: result.unit,
            referenceLow: result.referenceLow,
            referenceHigh: result.referenceHigh,
          })),
      },
      supplements: {
        active: input.supplements,
        intakeCount: input.supplementIntakes.length,
        possibleReactionCount: input.supplementIntakes.filter(
          ({ tolerance }) => tolerance === "POSSIBLE_REACTION",
        ).length,
        positiveEffectCount: input.supplementIntakes.filter(
          ({ effect }) => effect === "POSITIVE",
        ).length,
      },
    },
    dataGaps,
  };
}

export type HealthContext = ReturnType<typeof buildHealthContext>;
