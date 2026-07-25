import assert from "node:assert/strict";
import test from "node:test";

import { buildHealthContext } from "./health-context";
import { localStructuredProvider } from "./local-provider";
import {
  analyzeWithCompassProvider,
  createCompassAnalysisRequest,
  type CompassProvider,
} from "./provider";

function emptyContext() {
  return buildHealthContext({
    generatedAt: new Date("2026-07-25T12:00:00.000Z"),
    periodStart: new Date("2026-06-26T00:00:00.000Z"),
    periodEnd: new Date("2026-07-26T00:00:00.000Z"),
    periodDays: 30,
    trendSplitAt: new Date("2026-07-11T00:00:00.000Z"),
    timeZone: "Europe/Stockholm",
    profile: null,
    dailyEntries: [],
    weights: [],
    trainingSessions: [],
    labResults: [],
    supplements: [],
    supplementIntakes: [],
  });
}

test("creates a provider-neutral request with binding safety rules", () => {
  const request = createCompassAnalysisRequest(
    emptyContext(),
    new Date("2026-07-25T13:00:00.000Z"),
  );

  assert.equal(request.requestVersion, "compass-request.v1");
  assert.equal(request.purpose, "GENERAL_OVERVIEW");
  assert.deepEqual(request.responseRules, {
    distinguishFactsAndLimitations: true,
    diagnose: false,
    writeBackAutomatically: false,
  });
  assert.equal("userId" in request, false);
});

test("runs the local reference provider without external transfer", async () => {
  const request = createCompassAnalysisRequest(emptyContext());
  const response = await analyzeWithCompassProvider(
    localStructuredProvider,
    request,
    { allowExternalTransfer: false },
  );

  assert.equal(response.provider.mode, "LOCAL");
  assert.equal(response.provider.externalTransferPerformed, false);
  assert.equal(response.statements.length, 0);
  assert.equal(response.limitations.length, 6);
});

test("blocks a remote provider before it receives health context", async () => {
  let called = false;
  const remoteProvider: CompassProvider = {
    id: "remote-test",
    label: "Remote test",
    mode: "REMOTE",
    async analyze() {
      called = true;
      throw new Error("should not be called");
    },
  };

  await assert.rejects(
    analyzeWithCompassProvider(
      remoteProvider,
      createCompassAnalysisRequest(emptyContext()),
      { allowExternalTransfer: false },
    ),
    /nicht freigegeben/,
  );
  assert.equal(called, false);
});
