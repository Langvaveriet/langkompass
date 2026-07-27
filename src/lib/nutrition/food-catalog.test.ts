import assert from "node:assert/strict";
import test from "node:test";

import {
  catalogFoodEnergyKcal,
  foodCatalog,
  foodCatalogByKey,
} from "./food-catalog";

test("enthält konkrete mediterran-ketogene Lebensmittel", () => {
  for (const key of [
    "cottage-cheese",
    "skyr",
    "avocado",
    "olive-oil",
    "salmon",
    "feta",
    "zucchini",
    "almonds",
  ]) {
    assert.ok(foodCatalogByKey.has(key), `${key} fehlt im Lebensmittelkatalog`);
  }
});

test("verwendet eindeutige Schlüssel und plausible Portionswerte", () => {
  assert.equal(foodCatalogByKey.size, foodCatalog.length);

  for (const food of foodCatalog) {
    assert.ok(food.kcalPer100 >= 0 && food.kcalPer100 <= 1000);
    assert.ok(food.portions.SMALL > 0);
    assert.ok(food.portions.SMALL < food.portions.MEDIUM);
    assert.ok(food.portions.MEDIUM < food.portions.LARGE);
  }
});

test("berechnet die Kalorien aus der gewählten Grammportion", () => {
  const cottageCheese = foodCatalogByKey.get("cottage-cheese");
  assert.ok(cottageCheese);
  assert.equal(catalogFoodEnergyKcal(cottageCheese, "MEDIUM"), 196);

  const oliveOil = foodCatalogByKey.get("olive-oil");
  assert.ok(oliveOil);
  assert.equal(catalogFoodEnergyKcal(oliveOil, "LARGE"), 123);
});
