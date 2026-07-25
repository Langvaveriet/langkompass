import assert from "node:assert/strict";
import test from "node:test";

import { buildHealthContext } from "./health-context";

test("builds a deterministic context without direct identifiers or free text", () => {
  const context = buildHealthContext({
    generatedAt: new Date("2026-07-25T12:00:00.000Z"),
    periodStart: new Date("2026-06-26T00:00:00.000Z"),
    periodEnd: new Date("2026-07-26T00:00:00.000Z"),
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
        painLevel: 2,
        stressLevel: 4,
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
        painLevel: 4,
        stressLevel: 2,
        symptomTags: ["Kopfschmerz"],
        activityTags: [],
        meals: [{ energyKcal: null, category: "VEGETABLE", traits: ["FERMENTED"] }],
      },
    ],
    weights: [
      { measuredAt: new Date("2026-07-01T08:00:00.000Z"), valueKg: 90 },
      { measuredAt: new Date("2026-07-25T08:00:00.000Z"), valueKg: 88.5 },
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
  assert.equal(context.observations.body.weightChangeKg, -1.5);
  assert.equal(context.observations.nutrition.estimatedEnergyKcal, 450);
  assert.equal(context.observations.laboratory.latestResults[0]?.value, 90);
  assert.equal(context.observations.supplements.positiveEffectCount, 1);
});

test("reports missing data without inventing observations", () => {
  const context = buildHealthContext({
    generatedAt: new Date("2026-07-25T12:00:00.000Z"),
    periodStart: new Date("2026-06-26T00:00:00.000Z"),
    periodEnd: new Date("2026-07-26T00:00:00.000Z"),
    timeZone: "Europe/Stockholm",
    profile: null,
    dailyEntries: [],
    weights: [],
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
