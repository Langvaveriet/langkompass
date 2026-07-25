import assert from "node:assert/strict";
import test from "node:test";

import {
  buildDailyIntakeCounts,
  summarizeSupplementIntakes,
} from "./intake-history";

test("summarizes documented supplement intakes without medical inference", () => {
  const intakes = [
    { takenAt: new Date("2026-07-24T08:00:00Z"), tolerance: "WELL_TOLERATED" as const, effect: "POSITIVE" as const },
    { takenAt: new Date("2026-07-24T20:00:00Z"), tolerance: "NEUTRAL" as const, effect: "NOT_RATED" as const },
    { takenAt: new Date("2026-07-25T08:00:00Z"), tolerance: "POSSIBLE_REACTION" as const, effect: "UNCLEAR" as const },
  ];

  assert.deepEqual(
    summarizeSupplementIntakes(intakes, (date) => date.toISOString().slice(0, 10)),
    {
      intakeCount: 3,
      recordedDays: 2,
      wellToleratedCount: 1,
      possibleReactionCount: 1,
      positiveEffectCount: 1,
    },
  );
});

test("fills missing chart days with zero documented intakes", () => {
  const result = buildDailyIntakeCounts(
    [{ takenAt: new Date("2026-07-24T08:00:00Z") }],
    ["2026-07-23", "2026-07-24", "2026-07-25"],
    (date) => date.toISOString().slice(0, 10),
  );

  assert.deepEqual(result, [
    { key: "2026-07-23", count: 0 },
    { key: "2026-07-24", count: 1 },
    { key: "2026-07-25", count: 0 },
  ]);
});
