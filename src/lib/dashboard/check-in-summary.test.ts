import assert from "node:assert/strict";
import test from "node:test";

import { summarizeCheckIns } from "./check-in-summary";

test("summarizes structured daily activity and hydration values", () => {
  const summary = summarizeCheckIns([
    {
      status: "COMPLETED",
      sleepHours: 7,
      energy: 6,
      wellbeing: 8,
      waterLiters: 2,
      steps: 8000,
      activeMinutes: 40,
    },
    {
      status: "MORNING_DONE",
      sleepHours: 8,
      energy: 8,
      wellbeing: null,
      waterLiters: 3,
      steps: 10000,
      activeMinutes: 60,
    },
  ]);

  assert.deepEqual(summary, {
    recordedDays: 2,
    completedDays: 1,
    averageSleepHours: 7.5,
    averageEnergy: 7,
    averageWellbeing: 8,
    averageWaterLiters: 2.5,
    averageSteps: 9000,
    averageActiveMinutes: 50,
  });
});

test("keeps missing optional values empty", () => {
  const summary = summarizeCheckIns([
    {
      status: "OPEN",
      sleepHours: null,
      energy: null,
      wellbeing: null,
      waterLiters: null,
      steps: null,
      activeMinutes: null,
    },
  ]);

  assert.equal(summary.averageWaterLiters, null);
  assert.equal(summary.averageSteps, null);
  assert.equal(summary.averageActiveMinutes, null);
});
