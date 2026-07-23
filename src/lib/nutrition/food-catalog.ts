import type { FoodCategory, FoodTrait } from "@/generated/prisma/enums";

export type FoodCatalogItem = {
  key: string;
  name: string;
  emoji: string;
  category: FoodCategory;
  traits: FoodTrait[];
};

export const foodCatalog: FoodCatalogItem[] = [
  { key: "oats", name: "Haferflocken", emoji: "🥣", category: "GRAIN", traits: [] },
  { key: "bread", name: "Brot", emoji: "🍞", category: "GRAIN", traits: [] },
  { key: "rice", name: "Reis", emoji: "🍚", category: "GRAIN", traits: [] },
  { key: "pasta", name: "Nudeln", emoji: "🍝", category: "GRAIN", traits: [] },
  { key: "potato", name: "Kartoffeln", emoji: "🥔", category: "VEGETABLE", traits: [] },
  { key: "vegetables", name: "Gemüse", emoji: "🥦", category: "VEGETABLE", traits: [] },
  { key: "salad", name: "Salat", emoji: "🥗", category: "VEGETABLE", traits: [] },
  { key: "fruit", name: "Obst", emoji: "🍎", category: "FRUIT", traits: [] },
  { key: "banana", name: "Banane", emoji: "🍌", category: "FRUIT", traits: ["HISTAMINE_LIBERATOR"] },
  { key: "nuts", name: "Nüsse", emoji: "🥜", category: "NUT_SEED", traits: ["HISTAMINE_LIBERATOR"] },
  { key: "yogurt", name: "Joghurt", emoji: "🥛", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"] },
  { key: "cheese", name: "Käse", emoji: "🧀", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"] },
  { key: "egg", name: "Ei", emoji: "🥚", category: "EGG", traits: [] },
  { key: "chicken", name: "Hähnchen", emoji: "🍗", category: "MEAT", traits: [] },
  { key: "meat", name: "Fleisch", emoji: "🥩", category: "MEAT", traits: [] },
  { key: "fish", name: "Fisch", emoji: "🐟", category: "FISH_SEAFOOD", traits: ["HISTAMINE_RICH"] },
  { key: "ready-meal", name: "Fertiggericht", emoji: "🥡", category: "PREPARED_MEAL", traits: ["HIGHLY_PROCESSED"] },
  { key: "sweets", name: "Süßes", emoji: "🍫", category: "SWEET", traits: ["HIGH_SUGAR"] },
  { key: "water", name: "Wasser", emoji: "💧", category: "BEVERAGE", traits: [] },
  { key: "coffee", name: "Kaffee", emoji: "☕", category: "BEVERAGE", traits: ["CAFFEINATED"] },
  { key: "tea", name: "Tee", emoji: "🍵", category: "BEVERAGE", traits: [] },
  { key: "soft-drink", name: "Softdrink", emoji: "🥤", category: "BEVERAGE", traits: ["HIGH_SUGAR"] },
  { key: "wine", name: "Wein", emoji: "🍷", category: "BEVERAGE", traits: ["ALCOHOLIC", "HISTAMINE_RICH", "FERMENTED"] },
  { key: "beer", name: "Bier", emoji: "🍺", category: "BEVERAGE", traits: ["ALCOHOLIC", "HISTAMINE_RICH", "FERMENTED"] },
];

export const foodCatalogByKey = new Map(
  foodCatalog.map((item) => [item.key, item]),
);
