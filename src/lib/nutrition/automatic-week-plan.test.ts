import assert from "node:assert/strict";
import test from "node:test";

import { buildAutomaticWeekPlan } from "@/lib/nutrition/automatic-week-plan";

const dates = ["2026-07-20", "2026-07-21", "2026-07-22"];

test("verteilt Rezepte je Mahlzeitentyp über alle Tage", () => {
  const result = buildAutomaticWeekPlan(dates, ["BREAKFAST", "DINNER"], [
    { key: "breakfast-a", type: "BREAKFAST", favorite: false },
    { key: "breakfast-b", type: "BREAKFAST", favorite: false },
    { key: "dinner-a", type: "DINNER", favorite: false },
  ]);

  assert.equal(result.length, 6);
  assert.equal(new Set(result.filter(({ type }) => type === "BREAKFAST").map(({ recipeKey }) => recipeKey)).size, 2);
  assert.deepEqual(result.filter(({ type }) => type === "DINNER").map(({ recipeKey }) => recipeKey), ["dinner-a", "dinner-a", "dinner-a"]);
});

test("berücksichtigt Favoriten zuerst und bleibt für dieselbe Woche stabil", () => {
  const recipes = [
    { key: "regular", type: "LUNCH" as const, favorite: false },
    { key: "favorite", type: "LUNCH" as const, favorite: true },
  ];
  const first = buildAutomaticWeekPlan(dates, ["LUNCH"], recipes);
  const second = buildAutomaticWeekPlan(dates, ["LUNCH"], recipes);

  assert.equal(first[0].recipeKey, "favorite");
  assert.deepEqual(first, second);
});

test("überspringt Mahlzeitentypen ohne passende Rezepte", () => {
  assert.deepEqual(
    buildAutomaticWeekPlan(dates, ["SNACK"], [
      { key: "breakfast", type: "BREAKFAST", favorite: true },
    ]),
    [],
  );
});
