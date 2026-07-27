import assert from "node:assert/strict";
import test from "node:test";

import {
  trainingSessionCancellationSchema,
  trainingSessionDeletionSchema,
} from "./training-session-lifecycle";

test("eine Trainingseinheit kann nur ausdrücklich abgebrochen werden", () => {
  assert.equal(
    trainingSessionCancellationSchema.safeParse({
      trainingSessionId: "session-1",
      confirmation: "ABORT",
    }).success,
    true,
  );
  assert.equal(
    trainingSessionCancellationSchema.safeParse({
      trainingSessionId: "session-1",
      confirmation: "DELETE",
    }).success,
    false,
  );
});

test("eine Trainingseinheit kann nur ausdrücklich gelöscht werden", () => {
  assert.equal(
    trainingSessionDeletionSchema.safeParse({
      trainingSessionId: "session-1",
      confirmation: "DELETE",
    }).success,
    true,
  );
  assert.equal(
    trainingSessionDeletionSchema.safeParse({
      trainingSessionId: "session-1",
      confirmation: "",
    }).success,
    false,
  );
});
