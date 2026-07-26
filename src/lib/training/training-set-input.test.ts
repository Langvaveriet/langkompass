import assert from "node:assert/strict";
import test from "node:test";

import { trainingSetInputSchema } from "@/lib/training/training-set-input";

const validSet = {
  trainingSessionId: "session-1",
  exerciseId: "exercise-1",
  repetitions: "12",
  weightKg: "42,5",
  effort: "7",
};

test("normalizes a complete documented training set", () => {
  assert.deepEqual(trainingSetInputSchema.parse(validSet), {
    trainingSessionId: "session-1",
    exerciseId: "exercise-1",
    repetitions: 12,
    weightKg: 42.5,
    effort: 7,
  });
});

test("allows bodyweight sets without weight and effort", () => {
  const parsed = trainingSetInputSchema.parse({
    ...validSet,
    weightKg: "",
    effort: "",
  });

  assert.equal(parsed.weightKg, null);
  assert.equal(parsed.effort, null);
});

test("rejects invalid repetitions, weights and effort", () => {
  assert.equal(
    trainingSetInputSchema.safeParse({ ...validSet, repetitions: "0" })
      .success,
    false,
  );
  assert.equal(
    trainingSetInputSchema.safeParse({ ...validSet, weightKg: "2001" })
      .success,
    false,
  );
  assert.equal(
    trainingSetInputSchema.safeParse({ ...validSet, effort: "11" }).success,
    false,
  );
});
