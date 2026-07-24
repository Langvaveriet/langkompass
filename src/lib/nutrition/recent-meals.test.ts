import assert from "node:assert/strict";
import test from "node:test";

import { uniqueRecentMeals } from "./recent-meals";

const meal = (
  id: string,
  type: string,
  foods: Array<[string | null, string, string, number | null]>,
) => ({
  id,
  type,
  items: foods.map(([foodKey, name, portion, quantity]) => ({
    foodKey,
    name,
    portion,
    quantity,
  })),
});

test("behält nur die neueste identische Mahlzeit", () => {
  const meals = [
    meal("new", "BREAKFAST", [["yogurt", "Joghurt", "MEDIUM", 200]]),
    meal("old", "BREAKFAST", [["yogurt", "Joghurt", "MEDIUM", 200]]),
  ];

  assert.deepEqual(uniqueRecentMeals(meals).map(({ id }) => id), ["new"]);
});

test("erkennt eine andere Portionsgröße als eigenen Vorschlag", () => {
  const meals = [
    meal("large", "SNACK", [["nuts", "Nüsse", "LARGE", 45]]),
    meal("small", "SNACK", [["nuts", "Nüsse", "SMALL", 15]]),
  ];

  assert.deepEqual(uniqueRecentMeals(meals).map(({ id }) => id), [
    "large",
    "small",
  ]);
});

test("überspringt leere Mahlzeiten und begrenzt die Vorschläge", () => {
  const meals = [
    meal("empty", "DRINK", []),
    meal("one", "LUNCH", [[null, "Suppe", "MEDIUM", null]]),
    meal("two", "DINNER", [[null, "Salat", "MEDIUM", null]]),
  ];

  assert.deepEqual(uniqueRecentMeals(meals, 1).map(({ id }) => id), ["one"]);
});
