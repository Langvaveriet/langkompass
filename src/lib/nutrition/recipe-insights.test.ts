import assert from "node:assert/strict";
import test from "node:test";

import {
  buildMicronutrientSourceHints,
  rankRecipeAlternatives,
} from "./recipe-insights";

test("leitet nachvollziehbare Mikronährstoffquellen aus Zutaten ab", () => {
  const hints = buildMicronutrientSourceHints([
    { name: "Lachsfilet", category: "FISH_SEAFOOD" },
    { name: "Blattspinat", category: "VEGETABLE" },
    { name: "Avocado", category: "FRUIT" },
  ]);

  assert.ok(hints.some(({ nutrient, sources }) =>
    nutrient === "Omega-3-Fettsäuren" && sources.includes("Lachsfilet"),
  ));
  assert.ok(hints.some(({ nutrient, sources }) =>
    nutrient === "Folat" && sources.includes("Blattspinat"),
  ));
});

test("erfindet ohne passende Zutaten keine Mikronährstoffquelle", () => {
  assert.deepEqual(
    buildMicronutrientSourceHints([{ name: "Wasser", category: "BEVERAGE" }]),
    [],
  );
});

test("ordnet ähnliche Ernährungsrichtung und Zutatenkategorien zuerst", () => {
  const current = {
    id: "current",
    dietaryPatterns: ["MEDITERRANEAN", "KETOGENIC"],
    items: [{ name: "Lachs", category: "FISH_SEAFOOD" }],
  };
  const ranked = rankRecipeAlternatives(current, [
    { id: "c", dietaryPatterns: ["VEGETARIAN"], items: [{ name: "Ei", category: "EGG" }] },
    { id: "a", dietaryPatterns: ["MEDITERRANEAN", "KETOGENIC"], items: [{ name: "Sardinen", category: "FISH_SEAFOOD" }] },
    { id: "b", dietaryPatterns: ["MEDITERRANEAN"], items: [{ name: "Hähnchen", category: "MEAT" }] },
  ]);

  assert.deepEqual(ranked.map(({ id }) => id), ["a", "b", "c"]);
});
