import assert from "node:assert/strict";
import test from "node:test";

import {
  supplementIntakeCorrectionInputSchema,
  supplementIntakeInputSchema,
} from "@/lib/supplements/intake-input";

const intake = {
  supplementId: "supplement-1",
  takenDate: "2026-07-26",
  takenTime: "08:15",
  dose: "1,5",
  tolerance: "WELL_TOLERATED",
  effect: "POSITIVE",
  note: "Nach dem Frühstück",
} as const;

test("normalizes a documented supplement intake", () => {
  const parsed = supplementIntakeInputSchema.parse(intake);

  assert.equal(parsed.dose, 1.5);
  assert.equal(parsed.note, "Nach dem Frühstück");
});

test("rejects impossible intake dates, times and doses", () => {
  assert.equal(
    supplementIntakeInputSchema.safeParse({
      ...intake,
      takenDate: "2026-02-30",
      takenTime: "25:00",
      dose: "0",
    }).success,
    false,
  );
});

test("requires a documented reason for intake corrections", () => {
  const correction = supplementIntakeCorrectionInputSchema.safeParse({
    ...intake,
    intakeId: "intake-1",
    doseUnit: "CAPSULE",
    reason: "DOSE_CORRECTION",
  });
  const invalidCorrection = supplementIntakeCorrectionInputSchema.safeParse({
    ...intake,
    intakeId: "intake-1",
    doseUnit: "CAPSULE",
    reason: "",
  });

  assert.equal(correction.success, true);
  assert.equal(invalidCorrection.success, false);
});
