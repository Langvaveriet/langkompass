import type {
  FoodCategory,
  FoodTrait,
  QuantityUnit,
} from "@/generated/prisma/enums";

export type FoodCatalogItem = {
  key: string;
  name: string;
  emoji: string;
  category: FoodCategory;
  traits: FoodTrait[];
  unit: Extract<QuantityUnit, "GRAM" | "MILLILITER">;
  portions: Record<"SMALL" | "MEDIUM" | "LARGE", number>;
  kcalPer100: number;
};

export const foodCatalog: FoodCatalogItem[] = [
  { key: "oats", name: "Haferflocken", emoji: "🥣", category: "GRAIN", traits: [], unit: "GRAM", portions: { SMALL: 30, MEDIUM: 50, LARGE: 80 }, kcalPer100: 370 },
  { key: "bread", name: "Brot", emoji: "🍞", category: "GRAIN", traits: [], unit: "GRAM", portions: { SMALL: 40, MEDIUM: 80, LARGE: 120 }, kcalPer100: 250 },
  { key: "rice", name: "Reis, gekocht", emoji: "🍚", category: "GRAIN", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 180, LARGE: 250 }, kcalPer100: 130 },
  { key: "pasta", name: "Nudeln, gekocht", emoji: "🍝", category: "GRAIN", traits: [], unit: "GRAM", portions: { SMALL: 120, MEDIUM: 200, LARGE: 300 }, kcalPer100: 150 },
  { key: "potato", name: "Kartoffeln", emoji: "🥔", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 120, MEDIUM: 200, LARGE: 300 }, kcalPer100: 75 },
  { key: "vegetables", name: "Gemüse", emoji: "🥦", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 40 },
  { key: "salad", name: "Salat", emoji: "🥗", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 60, MEDIUM: 120, LARGE: 200 }, kcalPer100: 20 },
  { key: "fruit", name: "Obst", emoji: "🍎", category: "FRUIT", traits: [], unit: "GRAM", portions: { SMALL: 80, MEDIUM: 150, LARGE: 250 }, kcalPer100: 55 },
  { key: "banana", name: "Banane", emoji: "🍌", category: "FRUIT", traits: ["HISTAMINE_LIBERATOR"], unit: "GRAM", portions: { SMALL: 80, MEDIUM: 120, LARGE: 180 }, kcalPer100: 89 },
  { key: "nuts", name: "Nüsse", emoji: "🥜", category: "NUT_SEED", traits: ["HISTAMINE_LIBERATOR"], unit: "GRAM", portions: { SMALL: 15, MEDIUM: 30, LARGE: 50 }, kcalPer100: 600 },
  { key: "yogurt", name: "Joghurt", emoji: "🥛", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 65 },
  { key: "cheese", name: "Käse", emoji: "🧀", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 20, MEDIUM: 40, LARGE: 70 }, kcalPer100: 350 },
  { key: "egg", name: "Ei", emoji: "🥚", category: "EGG", traits: [], unit: "GRAM", portions: { SMALL: 50, MEDIUM: 100, LARGE: 150 }, kcalPer100: 155 },
  { key: "chicken", name: "Hähnchen", emoji: "🍗", category: "MEAT", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 150, LARGE: 220 }, kcalPer100: 165 },
  { key: "meat", name: "Fleisch", emoji: "🥩", category: "MEAT", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 150, LARGE: 220 }, kcalPer100: 220 },
  { key: "fish", name: "Fisch", emoji: "🐟", category: "FISH_SEAFOOD", traits: ["HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 160, LARGE: 240 }, kcalPer100: 150 },
  { key: "ready-meal", name: "Fertiggericht", emoji: "🥡", category: "PREPARED_MEAL", traits: ["HIGHLY_PROCESSED"], unit: "GRAM", portions: { SMALL: 250, MEDIUM: 400, LARGE: 600 }, kcalPer100: 160 },
  { key: "sweets", name: "Süßes", emoji: "🍫", category: "SWEET", traits: ["HIGH_SUGAR"], unit: "GRAM", portions: { SMALL: 20, MEDIUM: 40, LARGE: 80 }, kcalPer100: 500 },
  { key: "water", name: "Wasser", emoji: "💧", category: "BEVERAGE", traits: [], unit: "MILLILITER", portions: { SMALL: 200, MEDIUM: 350, LARGE: 500 }, kcalPer100: 0 },
  { key: "coffee", name: "Kaffee", emoji: "☕", category: "BEVERAGE", traits: ["CAFFEINATED"], unit: "MILLILITER", portions: { SMALL: 125, MEDIUM: 200, LARGE: 300 }, kcalPer100: 2 },
  { key: "tea", name: "Tee", emoji: "🍵", category: "BEVERAGE", traits: [], unit: "MILLILITER", portions: { SMALL: 200, MEDIUM: 300, LARGE: 500 }, kcalPer100: 1 },
  { key: "soft-drink", name: "Softdrink", emoji: "🥤", category: "BEVERAGE", traits: ["HIGH_SUGAR"], unit: "MILLILITER", portions: { SMALL: 200, MEDIUM: 330, LARGE: 500 }, kcalPer100: 42 },
  { key: "wine", name: "Wein", emoji: "🍷", category: "BEVERAGE", traits: ["ALCOHOLIC", "HISTAMINE_RICH", "FERMENTED"], unit: "MILLILITER", portions: { SMALL: 100, MEDIUM: 150, LARGE: 250 }, kcalPer100: 85 },
  { key: "beer", name: "Bier", emoji: "🍺", category: "BEVERAGE", traits: ["ALCOHOLIC", "HISTAMINE_RICH", "FERMENTED"], unit: "MILLILITER", portions: { SMALL: 250, MEDIUM: 330, LARGE: 500 }, kcalPer100: 43 },
];

export const foodCatalogByKey = new Map(
  foodCatalog.map((item) => [item.key, item]),
);
