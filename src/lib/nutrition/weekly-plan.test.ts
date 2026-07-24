import assert from "node:assert/strict";
import test from "node:test";

import {
  addIsoDays,
  isIsoDate,
  isoWeekDates,
  startOfIsoWeek,
} from "./weekly-plan";

test("validiert echte ISO-Kalendertage", () => {
  assert.equal(isIsoDate("2026-07-24"), true);
  assert.equal(isIsoDate("2026-02-30"), false);
  assert.equal(isIsoDate("24.07.2026"), false);
});

test("ermittelt Wochen von Montag bis Sonntag über Monatsgrenzen", () => {
  assert.equal(startOfIsoWeek("2026-08-01"), "2026-07-27");
  assert.deepEqual(isoWeekDates("2026-08-01"), [
    "2026-07-27",
    "2026-07-28",
    "2026-07-29",
    "2026-07-30",
    "2026-07-31",
    "2026-08-01",
    "2026-08-02",
  ]);
  assert.equal(addIsoDays("2026-12-31", 1), "2027-01-01");
});
