import assert from "node:assert/strict";
import test from "node:test";

import { buildLabTrend } from "./lab-trend";

test("sorts laboratory measurements and calculates descriptive changes", () => {
  const trend = buildLabTrend([
    { id: "new", measuredAt: new Date("2026-06-29T08:00:00Z"), value: 12 },
    { id: "old", measuredAt: new Date("2026-05-19T08:00:00Z"), value: 20 },
  ]);

  assert.deepEqual(trend.points.map(({ id }) => id), ["old", "new"]);
  assert.equal(trend.firstValue, 20);
  assert.equal(trend.latestValue, 12);
  assert.equal(trend.difference, -8);
  assert.equal(trend.minimum, 12);
  assert.equal(trend.maximum, 20);
});

test("returns an empty summary without finite measurements", () => {
  const trend = buildLabTrend([
    { id: "invalid", measuredAt: new Date("2026-06-29T08:00:00Z"), value: Number.NaN },
  ]);

  assert.deepEqual(trend.points, []);
  assert.equal(trend.firstValue, null);
  assert.equal(trend.latestValue, null);
  assert.equal(trend.difference, null);
});
