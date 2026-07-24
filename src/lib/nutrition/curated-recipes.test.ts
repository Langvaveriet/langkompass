import assert from "node:assert/strict";
import test from "node:test";

import {
  curatedRecipeImportSchema,
  curatedRecipes,
  curatedRecipesByKey,
  suggestedCuratedRecipe,
  suggestedRecipeFromCatalog,
} from "./curated-recipes";

test("enthält zwanzig eindeutig identifizierbare Rezeptvorschläge", () => {
  assert.equal(curatedRecipes.length, 20);
  assert.equal(curatedRecipesByKey.size, 20);
});

test("alle Vorschläge besitzen strukturierte Nährwerte und Zutaten", () => {
  assert.equal(curatedRecipeImportSchema.safeParse(curatedRecipes).success, true);
  for (const recipe of curatedRecipes) {
    assert.ok(recipe.items.length >= 2);
    assert.ok(recipe.instructions.length >= 1);
    assert.ok(recipe.prepMinutes > 0);
    assert.ok(recipe.carbohydrateGrams >= 0);
    assert.ok(recipe.dietaryPatterns.includes("MEDITERRANEAN"));
    assert.ok(recipe.dietaryPatterns.includes("KETOGENIC"));
  }
});

test("wählt aus einem erweiterbaren Katalog und beachtet den Typ", () => {
  const suggestion = suggestedRecipeFromCatalog(
    curatedRecipes,
    "importierter-katalog",
    "SNACK",
  );

  assert.equal(suggestion?.type, "SNACK");
  assert.equal(suggestedRecipeFromCatalog([], "leer"), null);
});

test("filtert einen Vorschlag stabil nach Mahlzeitentyp", () => {
  const first = suggestedCuratedRecipe("gleicher-wert", "DINNER");
  const second = suggestedCuratedRecipe("gleicher-wert", "DINNER");

  assert.equal(first.key, second.key);
  assert.equal(first.type, "DINNER");
});
