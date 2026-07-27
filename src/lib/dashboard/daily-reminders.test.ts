import assert from "node:assert/strict";
import test from "node:test";

import { buildDailyReminders } from "./daily-reminders";

test("zeigt beide Erinnerungen, solange heute beide Angaben fehlen", () => {
  const reminders = buildDailyReminders({
    date: "2026-07-27",
    hasWeightMeasurement: false,
    supplementIntakeCount: 0,
    activeSupplementCount: 2,
  });

  assert.deepEqual(reminders.map(({ key }) => key), ["weight", "supplements"]);
  assert.equal(reminders[0]?.href, "/tageserfassung?date=2026-07-27#morgen-check");
  assert.equal(reminders[1]?.href, "/supplemente#active-supplements-heading");
});

test("blendet jede erledigte Erinnerung unabhängig aus", () => {
  assert.deepEqual(
    buildDailyReminders({
      date: "2026-07-27",
      hasWeightMeasurement: true,
      supplementIntakeCount: 0,
      activeSupplementCount: 1,
    }).map(({ key }) => key),
    ["supplements"],
  );
  assert.deepEqual(
    buildDailyReminders({
      date: "2026-07-27",
      hasWeightMeasurement: false,
      supplementIntakeCount: 1,
      activeSupplementCount: 1,
    }).map(({ key }) => key),
    ["weight"],
  );
  assert.deepEqual(
    buildDailyReminders({
      date: "2026-07-27",
      hasWeightMeasurement: true,
      supplementIntakeCount: 1,
      activeSupplementCount: 1,
    }),
    [],
  );
});

test("führt ohne aktives Präparat zur Supplementeinrichtung", () => {
  const reminder = buildDailyReminders({
    date: "2026-07-27",
    hasWeightMeasurement: true,
    supplementIntakeCount: 0,
    activeSupplementCount: 0,
  })[0];

  assert.equal(reminder?.title, "Supplemente einrichten");
  assert.equal(reminder?.href, "/supplemente");
});
