import { buildHealthContext } from "@/lib/compass/health-context";
import { estimatedFoodEnergy } from "@/lib/nutrition/energy";
import { prisma } from "@/lib/prisma";
import {
  dateInTimeZone,
  defaultTimeZone,
  localDateTimeToUtc,
} from "@/lib/user-settings";

function addUtcDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export async function loadHealthContext(userId: string, now = new Date()) {
  const settings = await prisma.userSettings.findUnique({
    where: { userId },
    select: { timeZone: true },
  });
  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const today = new Date(`${dateInTimeZone(now, timeZone)}T00:00:00.000Z`);
  const periodStartDate = addUtcDays(today, -29);
  const periodEndDate = addUtcDays(today, 1);
  const periodStart = localDateTimeToUtc(
    periodStartDate.toISOString().slice(0, 10),
    "00:00",
    timeZone,
  );
  const periodEnd = localDateTimeToUtc(
    periodEndDate.toISOString().slice(0, 10),
    "00:00",
    timeZone,
  );

  const [profile, entries, weights, trainingSessions, labResults, supplements, supplementIntakes] = await Promise.all([
    prisma.healthProfile.findUnique({
      where: { userId },
      select: {
        heightCm: true,
        weightGoal: true,
        activityLevel: true,
        preferredDietaryPatterns: true,
        excludedFoodCategories: true,
        avoidHistamine: true,
      },
    }),
    prisma.dailyEntry.findMany({
      where: {
        userId,
        entryDate: { gte: periodStartDate, lte: today },
      },
      orderBy: { entryDate: "asc" },
      select: {
        entryDate: true,
        status: true,
        sleepHours: true,
        sleepQuality: true,
        energy: true,
        wellbeing: true,
        painLevel: true,
        stressLevel: true,
        symptomTags: true,
        activityTags: true,
        meals: {
          select: {
            items: {
              select: {
                energyKcal: true,
                foodKey: true,
                quantity: true,
                category: true,
                traits: true,
              },
            },
          },
        },
      },
    }),
    prisma.bodyMeasurement.findMany({
      where: {
        userId,
        type: "WEIGHT",
        measuredAt: { gte: periodStart, lt: periodEnd },
      },
      orderBy: { measuredAt: "asc" },
      select: { measuredAt: true, value: true },
    }),
    prisma.trainingSession.findMany({
      where: {
        userId,
        completedAt: { gte: periodStart, lt: periodEnd },
      },
      orderBy: { completedAt: "asc" },
      select: {
        completedAt: true,
        _count: { select: { sets: true } },
      },
    }),
    prisma.labResult.findMany({
      where: { userId },
      orderBy: { measuredAt: "desc" },
      take: 200,
      select: {
        analyteKey: true,
        analyteName: true,
        measuredAt: true,
        value: true,
        unit: true,
        referenceLow: true,
        referenceHigh: true,
      },
    }),
    prisma.supplement.findMany({
      where: { userId, archivedAt: null },
      orderBy: { name: "asc" },
      select: {
        name: true,
        ingredients: {
          orderBy: { name: "asc" },
          select: { name: true },
        },
      },
    }),
    prisma.supplementIntake.findMany({
      where: {
        userId,
        takenAt: { gte: periodStart, lt: periodEnd },
      },
      orderBy: { takenAt: "asc" },
      select: { takenAt: true, tolerance: true, effect: true },
    }),
  ]);

  return buildHealthContext({
    generatedAt: now,
    periodStart,
    periodEnd,
    timeZone,
    profile: profile
      ? {
          heightCm: profile.heightCm,
          weightGoal: profile.weightGoal,
          activityLevel: profile.activityLevel,
          dietaryPatterns: profile.preferredDietaryPatterns,
          excludedFoodCategories: profile.excludedFoodCategories,
          avoidHistamine: profile.avoidHistamine,
        }
      : null,
    dailyEntries: entries.map((entry) => ({
      entryDate: entry.entryDate,
      status: entry.status,
      sleepHours: entry.sleepHours === null ? null : Number(entry.sleepHours),
      sleepQuality: entry.sleepQuality,
      energy: entry.energy,
      wellbeing: entry.wellbeing,
      painLevel: entry.painLevel,
      stressLevel: entry.stressLevel,
      symptomTags: entry.symptomTags,
      activityTags: entry.activityTags,
      meals: entry.meals.flatMap(({ items }) => items.map((item) => ({
        energyKcal: estimatedFoodEnergy(item),
        category: item.category,
        traits: item.traits,
      }))),
    })),
    weights: weights.map(({ measuredAt, value }) => ({
      measuredAt,
      valueKg: Number(value),
    })),
    trainingSessions: trainingSessions.flatMap((session) =>
      session.completedAt
        ? [{ completedAt: session.completedAt, setCount: session._count.sets }]
        : [],
    ),
    labResults: labResults.map((result) => ({
      analyteKey: result.analyteKey,
      analyteName: result.analyteName,
      measuredAt: result.measuredAt,
      value: Number(result.value),
      unit: result.unit,
      referenceLow: result.referenceLow === null ? null : Number(result.referenceLow),
      referenceHigh: result.referenceHigh === null ? null : Number(result.referenceHigh),
    })),
    supplements: supplements.map((supplement) => ({
      name: supplement.name,
      ingredients: supplement.ingredients.map(({ name }) => name),
    })),
    supplementIntakes,
  });
}
