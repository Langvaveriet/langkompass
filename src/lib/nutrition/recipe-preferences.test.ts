import assert from "node:assert/strict";
import test from "node:test";

import { curatedRecipesByKey } from "./curated-recipes";
import {
  hasRecipePreferences,
  recipeMatchesPreferences,
  recipePreferencesFromProfile,
  type RecipePreferences,
} from "./recipe-preferences";

const unrestricted: RecipePreferences = {
  dietaryPatterns: [],
  excludedFoodCategories: [],
  avoidHistamine: false,
  maxPrepMinutes: null,
};

test("akzeptiert ohne Präferenzen jedes Katalogrezept", () => {
  const recipe = curatedRecipesByKey.get("salmon-zucchini-pan")!;
  assert.equal(recipeMatchesPreferences(recipe, unrestricted), true);
  assert.equal(hasRecipePreferences(unrestricted), false);
});

test("bildet ein fehlendes Profil als uneingeschränkte Auswahl ab", () => {
  assert.deepEqual(recipePreferencesFromProfile(null), unrestricted);
});

test("berücksichtigt Ernährungsrichtung und Zubereitungszeit", () => {
  const vegetarian = curatedRecipesByKey.get("feta-zucchini-eggs")!;
  const meat = curatedRecipesByKey.get("chicken-ratatouille")!;
  const preferences: RecipePreferences = {
    ...unrestricted,
    dietaryPatterns: ["VEGETARIAN"],
    maxPrepMinutes: 20,
  };

  assert.equal(recipeMatchesPreferences(vegetarian, preferences), true);
  assert.equal(recipeMatchesPreferences(meat, preferences), false);
  assert.equal(hasRecipePreferences(preferences), true);
});

test("schließt Kategorien und Histaminmerkmale aus", () => {
  const fish = curatedRecipesByKey.get("salmon-zucchini-pan")!;
  const yogurt = curatedRecipesByKey.get("greek-yogurt-berries-walnuts")!;
  const eggs = curatedRecipesByKey.get("herb-omelette-spinach")!;

  assert.equal(recipeMatchesPreferences(fish, {
    ...unrestricted,
    excludedFoodCategories: ["FISH_SEAFOOD"],
  }), false);
  assert.equal(recipeMatchesPreferences(yogurt, {
    ...unrestricted,
    avoidHistamine: true,
  }), false);
  assert.equal(recipeMatchesPreferences(eggs, {
    ...unrestricted,
    avoidHistamine: true,
  }), true);
});
