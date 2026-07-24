import assert from "node:assert/strict";
import test from "node:test";

import { buildExerciseProgress } from "./exercise-progress";

test("bildet den höchsten Gewichtswert jeder Einheit chronologisch ab", () => {
  const progress = buildExerciseProgress([
    {
      id: "new",
      completedAt: new Date("2026-07-20T10:00:00Z"),
      sets: [
        { repetitions: 8, weightKg: 75 },
        { repetitions: 6, weightKg: 80 },
      ],
    },
    {
      id: "old",
      completedAt: new Date("2026-07-10T10:00:00Z"),
      sets: [
        { repetitions: 10, weightKg: 70 },
        { repetitions: 8, weightKg: 72.5 },
      ],
    },
  ]);

  assert.equal(progress.metric, "weight");
  assert.deepEqual(
    progress.points.map(({ sessionId, value }) => ({ sessionId, value })),
    [
      { sessionId: "old", value: 72.5 },
      { sessionId: "new", value: 80 },
    ],
  );
});

test("verwendet für Körpergewichtsübungen die maximalen Wiederholungen", () => {
  const progress = buildExerciseProgress([
    {
      id: "bodyweight",
      completedAt: new Date("2026-07-20T10:00:00Z"),
      sets: [
        { repetitions: 9, weightKg: null },
        { repetitions: 12, weightKg: null },
      ],
    },
  ]);

  assert.equal(progress.metric, "repetitions");
  assert.equal(progress.points[0]?.value, 12);
});

test("mischt fehlende Gewichte nicht in einen vorhandenen kg-Verlauf", () => {
  const progress = buildExerciseProgress([
    {
      id: "weighted",
      completedAt: new Date("2026-07-20T10:00:00Z"),
      sets: [{ repetitions: 8, weightKg: 50 }],
    },
    {
      id: "without-weight",
      completedAt: new Date("2026-07-21T10:00:00Z"),
      sets: [{ repetitions: 12, weightKg: null }],
    },
  ]);

  assert.equal(progress.metric, "weight");
  assert.deepEqual(progress.points.map((point) => point.sessionId), [
    "weighted",
  ]);
});
