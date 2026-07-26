import assert from "node:assert/strict";
import test from "node:test";

import { parseCompassReportPeriod } from "./report-periods";

test("accepts supported local report periods", () => {
  assert.equal(parseCompassReportPeriod("7"), 7);
  assert.equal(parseCompassReportPeriod("30"), 30);
  assert.equal(parseCompassReportPeriod("365"), 365);
});

test("falls back to the monthly report for invalid periods", () => {
  assert.equal(parseCompassReportPeriod(undefined), 30);
  assert.equal(parseCompassReportPeriod("90"), 30);
  assert.equal(parseCompassReportPeriod("anything"), 30);
});
