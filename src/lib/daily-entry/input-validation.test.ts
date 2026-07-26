import assert from "node:assert/strict";
import test from "node:test";

import {
  isTime,
  parseIsoDate,
  parseOptionalDecimal,
  parseOptionalInteger,
  parseOptionalScale,
} from "@/lib/daily-entry/input-validation";

test("accepts individual movement values within their documented limits", () => {
  assert.deepEqual(parseOptionalInteger("7867", 0, 250_000), {
    success: true,
    value: 7867,
  });
  assert.deepEqual(parseOptionalDecimal("6,23", 0, 1000), {
    success: true,
    value: "6.23",
  });
  assert.deepEqual(parseOptionalInteger("40", 0, 1440), {
    success: true,
    value: 40,
  });
});

test("rejects partial numbers and values outside their limits", () => {
  assert.deepEqual(parseOptionalInteger("7abc", 0, 10), { success: false });
  assert.deepEqual(parseOptionalInteger("1.5", 0, 250_000), {
    success: false,
  });
  assert.deepEqual(parseOptionalDecimal("6.234", 0, 1000), {
    success: false,
  });
  assert.deepEqual(parseOptionalDecimal("1001", 0, 1000), {
    success: false,
  });
});

test("keeps optional fields empty and validates scale boundaries", () => {
  assert.deepEqual(parseOptionalInteger(null, 0, 10), {
    success: true,
    value: null,
  });
  assert.deepEqual(parseOptionalScale("0", 0), {
    success: true,
    value: 0,
  });
  assert.deepEqual(parseOptionalScale("11"), { success: false });
});

test("accepts only real calendar dates and complete times", () => {
  assert.equal(parseIsoDate("2026-07-26").success, true);
  assert.deepEqual(parseIsoDate("2026-02-30"), { success: false });
  assert.deepEqual(parseIsoDate("26.07.2026"), { success: false });
  assert.equal(isTime("23:59"), true);
  assert.equal(isTime("24:00"), false);
});
