import assert from "node:assert/strict";
import test from "node:test";

import { supplementCreationIngredientsSchema } from "./supplement-product-input";

const ingredient = {
  ingredientName: "Magnesiumcitrat",
  ingredientAmount: "500",
  elementalAmount: "80",
  ingredientUnit: "MILLIGRAM",
};

test("akzeptiert mehrere unterschiedliche Wirkstoffe", () => {
  const result = supplementCreationIngredientsSchema.safeParse([
    ingredient,
    {
      ...ingredient,
      ingredientName: "Magnesiumbisglycinat",
      ingredientAmount: "400",
    },
  ]);

  assert.equal(result.success, true);
});

test("verlangt mindestens einen Wirkstoff und verhindert Dubletten", () => {
  assert.equal(supplementCreationIngredientsSchema.safeParse([]).success, false);
  assert.equal(
    supplementCreationIngredientsSchema.safeParse([
      ingredient,
      { ...ingredient, ingredientName: " magnesiumcitrat " },
    ]).success,
    false,
  );
});
