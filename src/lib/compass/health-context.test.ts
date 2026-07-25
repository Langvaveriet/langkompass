import assert from "node:assert/strict";
import test from "node:test";

import { buildHealthContext } from "./health-context";

test("builds a deterministic context without direct identifiers or free text", () => {
  const context = buildHealthContext({
    generatedAt: new Date("2026-07-25T12:00:00.000Z"),
    periodStart: new Date("2026-06-26T00:00:00.000Z"),
    periodEnd: new Date("2026-07-26T00:00:00.000Z"),
    periodDays: 30,
    trendSplitAt: new Date("2026-07-11T00:00:00.000Z"),
    timeZone: "Europe/Stockholm",
    profile: null,
    dailyEntries: [
      {
        entryDate: new Date("2026-07-24T00:00:00.000Z"),
        status: "COMPLETED",
        sleepHours: 7,
        sleepQuality: 8,
        energy: 6,
        wellbeing: 7,
        mood: 8,
        hungerLevel: 3,
        painLevel: 2,
        stressLevel: 4,
        waterLiters: 2.5,
        steps: 8000,
        distanceKm: 6.2,
        activeMinutes: 45,
        symptomTags: ["Kopfschmerz"],
        activityTags: ["Spaziergang"],
        meals: [{ energyKcal: 450, category: "FISH_SEAFOOD", traits: [] }],
      },
      {
        entryDate: new Date("2026-07-25T00:00:00.000Z"),
        status: "MORNING_DONE",
        sleepHours: 8,
        sleepQuality: 6,
        energy: 8,
        wellbeing: null,
        mood: 6,
        hungerLevel: 5,
        painLevel: 4,
        stressLevel: 2,
        waterLiters: 2,
        steps: 10000,
        distanceKm: 7.5,
        activeMinutes: 60,
        symptomTags: ["Kopfschmerz"],
        activityTags: [],
        meals: [{ energyKcal: null, category: "VEGETABLE", traits: ["FERMENTED"] }],
      },
    ],
    weights: [
      { measuredAt: new Date("2026-07-01T08:00:00.000Z"), valueKg: 90 },
      { measuredAt: new Date("2026-07-25T08:00:00.000Z"), valueKg: 88.5 },
    ],
    waistMeasurements: [
      { measuredAt: new Date("2026-07-01T08:00:00.000Z"), valueCm: 100 },
      { measuredAt: new Date("2026-07-25T08:00:00.000Z"), valueCm: 97.5 },
    ],
    trainingSessions: [{ completedAt: new Date("2026-07-24T18:00:00.000Z"), setCount: 12 }],
    labResults: [
      { analyteKey: "ferritin", analyteName: "Ferritin", measuredAt: new Date("2026-06-01T08:00:00.000Z"), value: 80, unit: "µg/L", referenceLow: 30, referenceHigh: 300 },
      { analyteKey: "ferritin", analyteName: "Ferritin", measuredAt: new Date("2026-07-01T08:00:00.000Z"), value: 90, unit: "µg/L", referenceLow: 30, referenceHigh: 300 },
    ],
    supplements: [{ name: "Magnesium", ingredients: ["Magnesiumcitrat"] }],
    supplementIntakes: [{ takenAt: new Date("2026-07-25T09:00:00.000Z"), tolerance: "WELL_TOLERATED", effect: "POSITIVE" }],
  });

  assert.equal(context.schemaVersion, "health-context.v1");
  assert.deepEqual(context.privacy, {
    directIdentifiersIncluded: false,
    freeTextIncluded: false,
    externalTransmissionPerformed: false,
    excludedFields: [
      "Name und E-Mail-Adresse",
      "Notizen und Symptom-Freitext",
      "Arztkommentare und Labor-/Praxisnamen",
    ],
  });
  assert.equal(context.observations.dailyCheckIns.averageSleepHours, 7.5);
  assert.equal(context.observations.dailyCheckIns.averageSteps, 9000);
  assert.equal(context.observations.body.weightChangeKg, -1.5);
  assert.equal(context.observations.body.waistChangeCm, -2.5);
  assert.equal(context.observations.nutrition.estimatedEnergyKcal, 450);
  assert.equal(context.observations.laboratory.latestResults[0]?.value, 90);
  assert.equal(context.observations.supplements.positiveEffectCount, 1);
  assert.deepEqual(context.observations.dailyCheckIns.trends.energy, null);
});

test("reports missing data without inventing observations", () => {
  const context = buildHealthContext({
    generatedAt: new Date("2026-07-25T12:00:00.000Z"),
    periodStart: new Date("2026-06-26T00:00:00.000Z"),
    periodEnd: new Date("2026-07-26T00:00:00.000Z"),
    periodDays: 30,
    trendSplitAt: new Date("2026-07-11T00:00:00.000Z"),
    timeZone: "Europe/Stockholm",
    profile: null,
    dailyEntries: [],
    weights: [],
    waistMeasurements: [],
    trainingSessions: [],
    labResults: [],
    supplements: [],
    supplementIntakes: [],
  });

  assert.equal(context.observations.dailyCheckIns.averageEnergy, null);
  assert.equal(context.observations.body.latestWeightKg, null);
  assert.equal(context.observations.nutrition.estimatedEnergyKcal, null);
  assert.equal(context.dataGaps.length, 6);
});

test("compares the first and second calendar half of a report", () => {
  const baseEntry = {
    status: "COMPLETED" as const,
    sleepQuality: null,
    wellbeing: null,
    mood: null,
    hungerLevel: null,
    painLevel: null,
    stressLevel: null,
    waterLiters: null,
    steps: null,
    distanceKm: null,
    activeMinutes: null,
    symptomTags: [],
    activityTags: [],
    meals: [],
  };
  const context = buildHealthContext({
    generatedAt: new Date("2026-07-25T12:00:00.000Z"),
    periodStart: new Date("2026-07-19T00:00:00.000Z"),
    periodEnd: new Date("2026-07-26T00:00:00.000Z"),
    periodDays: 7,
    trendSplitAt: new Date("2026-07-22T00:00:00.000Z"),
    timeZone: "Europe/Stockholm",
    profile: null,
    dailyEntries: [
      { ...baseEntry, entryDate: new Date("2026-07-20T00:00:00.000Z"), sleepHours: 6, energy: 5 },
      { ...baseEntry, entryDate: new Date("2026-07-21T00:00:00.000Z"), sleepHours: 8, energy: 7 },
      { ...baseEntry, entryDate: new Date("2026-07-24T00:00:00.000Z"), sleepHours: 8, energy: 8 },
      { ...baseEntry, entryDate: new Date("2026-07-25T00:00:00.000Z"), sleepHours: 9, energy: 8 },
    ],
    weights: [],
    waistMeasurements: [],
    trainingSessions: [],
    labResults: [],
    supplements: [],
    supplementIntakes: [],
  });

  assert.equal(context.period.days, 7);
  assert.deepEqual(context.observations.dailyCheckIns.trends.sleepHours, {
    earlierAverage: 7,
    recentAverage: 8.5,
    difference: 1.5,
  });
  assert.deepEqual(context.observations.dailyCheckIns.trends.energy, {
    earlierAverage: 6,
    recentAverage: 8,
    difference: 2,
  });
});
