import assert from "node:assert/strict";
import test from "node:test";

import {
  labReportInputSchema,
  labResultInputSchema,
} from "@/lib/labs/input-validation";

const reportId = "11111111-1111-4111-8111-111111111111";

test("accepts a structured laboratory report with optional fields", () => {
  const result = labReportInputSchema.parse({
    collectedDate: "2026-07-26",
    collectedTime: "08:30",
    fastingStatus: "FASTING",
    laboratory: "Vårdcentral",
    physicianComment: "",
    controlDate: "",
    notes: "",
  });

  assert.equal(result.physicianComment, null);
  assert.equal(result.controlDate, null);
});

test("rejects impossible collection dates and times", () => {
  const input = {
    collectedDate: "2026-02-30",
    collectedTime: "24:00",
    fastingStatus: "UNKNOWN",
    laboratory: "",
    physicianComment: "",
    controlDate: "",
    notes: "",
  };

  assert.equal(labReportInputSchema.safeParse(input).success, false);
});

test("normalizes decimal laboratory values and reference ranges", () => {
  const result = labResultInputSchema.parse({
    labReportId: reportId,
    analyteKey: "glucose",
    value: "5,4",
    referenceLow: "4,0",
    referenceHigh: "6,0",
    note: "",
  });

  assert.deepEqual(
    [result.value, result.referenceLow, result.referenceHigh],
    [5.4, 4, 6],
  );
});

test("rejects reversed laboratory reference ranges", () => {
  const result = labResultInputSchema.safeParse({
    labReportId: reportId,
    analyteKey: "glucose",
    value: "5.4",
    referenceLow: "7",
    referenceHigh: "4",
    note: "",
  });

  assert.equal(result.success, false);
});
