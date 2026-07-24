import assert from "node:assert/strict";
import test from "node:test";

import { summarizeMealPlan } from "./meal-plan-summary";

test("liefert ohne geplante Mahlzeiten eine leere Zusammenfassung", () => {
  assert.deepEqual(summarizeMealPlan([]), {
      plannedCount: 0,
      completedCount: 0,
      openCount: 0,
  });
});

test("trennt erfasste und offene Mahlzeiten", () => {
  assert.deepEqual(
    summarizeMealPlan([
        { completedAt: new Date("2026-07-24T08:00:00.000Z") },
        { completedAt: null },
        { completedAt: null },
    ]),
    {
      plannedCount: 3,
      completedCount: 1,
      openCount: 2,
    },
  );
});
