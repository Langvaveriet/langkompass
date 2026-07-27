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
  { key: "zucchini", name: "Zucchini", emoji: "🥒", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 17 },
  { key: "eggplant", name: "Aubergine", emoji: "🍆", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 25 },
  { key: "cauliflower", name: "Blumenkohl", emoji: "🥦", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 25 },
  { key: "broccoli", name: "Brokkoli", emoji: "🥦", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 34 },
  { key: "spinach", name: "Blattspinat", emoji: "🌿", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 75, MEDIUM: 150, LARGE: 250 }, kcalPer100: 23 },
  { key: "cucumber", name: "Gurke", emoji: "🥒", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 15 },
  { key: "tomato", name: "Tomaten", emoji: "🍅", category: "VEGETABLE", traits: ["HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 80, MEDIUM: 150, LARGE: 250 }, kcalPer100: 18 },
  { key: "bell-pepper", name: "Paprika", emoji: "🫑", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 80, MEDIUM: 150, LARGE: 250 }, kcalPer100: 31 },
  { key: "asparagus", name: "Grüner Spargel", emoji: "🌱", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 20 },
  { key: "mushrooms", name: "Champignons", emoji: "🍄", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 22 },
  { key: "green-beans", name: "Grüne Bohnen", emoji: "🫛", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 31 },
  { key: "artichoke", name: "Artischockenherzen", emoji: "🌿", category: "VEGETABLE", traits: [], unit: "GRAM", portions: { SMALL: 75, MEDIUM: 150, LARGE: 250 }, kcalPer100: 47 },
  { key: "fruit", name: "Obst", emoji: "🍎", category: "FRUIT", traits: [], unit: "GRAM", portions: { SMALL: 80, MEDIUM: 150, LARGE: 250 }, kcalPer100: 55 },
  { key: "banana", name: "Banane", emoji: "🍌", category: "FRUIT", traits: ["HISTAMINE_LIBERATOR"], unit: "GRAM", portions: { SMALL: 80, MEDIUM: 120, LARGE: 180 }, kcalPer100: 89 },
  { key: "avocado", name: "Avocado", emoji: "🥑", category: "FRUIT", traits: [], unit: "GRAM", portions: { SMALL: 70, MEDIUM: 140, LARGE: 210 }, kcalPer100: 160 },
  { key: "berries", name: "Beeren", emoji: "🫐", category: "FRUIT", traits: [], unit: "GRAM", portions: { SMALL: 50, MEDIUM: 100, LARGE: 150 }, kcalPer100: 50 },
  { key: "chickpeas", name: "Kichererbsen, gekocht", emoji: "🫘", category: "LEGUME", traits: [], unit: "GRAM", portions: { SMALL: 50, MEDIUM: 100, LARGE: 150 }, kcalPer100: 164 },
  { key: "hummus", name: "Hummus", emoji: "🫘", category: "LEGUME", traits: [], unit: "GRAM", portions: { SMALL: 30, MEDIUM: 60, LARGE: 100 }, kcalPer100: 166 },
  { key: "nuts", name: "Nüsse", emoji: "🥜", category: "NUT_SEED", traits: ["HISTAMINE_LIBERATOR"], unit: "GRAM", portions: { SMALL: 15, MEDIUM: 30, LARGE: 50 }, kcalPer100: 600 },
  { key: "almonds", name: "Mandeln", emoji: "🌰", category: "NUT_SEED", traits: ["HISTAMINE_LIBERATOR"], unit: "GRAM", portions: { SMALL: 15, MEDIUM: 30, LARGE: 50 }, kcalPer100: 579 },
  { key: "walnuts", name: "Walnüsse", emoji: "🌰", category: "NUT_SEED", traits: ["HISTAMINE_LIBERATOR"], unit: "GRAM", portions: { SMALL: 15, MEDIUM: 30, LARGE: 50 }, kcalPer100: 654 },
  { key: "pumpkin-seeds", name: "Kürbiskerne", emoji: "🌱", category: "NUT_SEED", traits: [], unit: "GRAM", portions: { SMALL: 10, MEDIUM: 20, LARGE: 30 }, kcalPer100: 559 },
  { key: "chia-seeds", name: "Chiasamen", emoji: "🌱", category: "NUT_SEED", traits: [], unit: "GRAM", portions: { SMALL: 10, MEDIUM: 20, LARGE: 30 }, kcalPer100: 486 },
  { key: "flaxseed", name: "Leinsamen", emoji: "🌱", category: "NUT_SEED", traits: [], unit: "GRAM", portions: { SMALL: 10, MEDIUM: 20, LARGE: 30 }, kcalPer100: 534 },
  { key: "tahini", name: "Tahin", emoji: "🥄", category: "NUT_SEED", traits: [], unit: "GRAM", portions: { SMALL: 15, MEDIUM: 30, LARGE: 45 }, kcalPer100: 595 },
  { key: "almond-butter", name: "Mandelmus", emoji: "🥄", category: "NUT_SEED", traits: [], unit: "GRAM", portions: { SMALL: 15, MEDIUM: 30, LARGE: 45 }, kcalPer100: 614 },
  { key: "yogurt", name: "Joghurt", emoji: "🥛", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 65 },
  { key: "cottage-cheese", name: "Hüttenkäse", emoji: "🥣", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 98 },
  { key: "skyr", name: "Skyr natur", emoji: "🥣", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 63 },
  { key: "greek-yogurt", name: "Griechischer Joghurt", emoji: "🥣", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 133 },
  { key: "quark", name: "Magerquark", emoji: "🥣", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 200, LARGE: 300 }, kcalPer100: 67 },
  { key: "cheese", name: "Käse", emoji: "🧀", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 20, MEDIUM: 40, LARGE: 70 }, kcalPer100: 350 },
  { key: "feta", name: "Feta", emoji: "🧀", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 30, MEDIUM: 60, LARGE: 100 }, kcalPer100: 265 },
  { key: "mozzarella", name: "Mozzarella", emoji: "🧀", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 60, MEDIUM: 125, LARGE: 200 }, kcalPer100: 250 },
  { key: "goat-cheese", name: "Ziegenkäse", emoji: "🧀", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 25, MEDIUM: 50, LARGE: 80 }, kcalPer100: 364 },
  { key: "halloumi", name: "Halloumi", emoji: "🧀", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 50, MEDIUM: 100, LARGE: 150 }, kcalPer100: 322 },
  { key: "ricotta", name: "Ricotta", emoji: "🧀", category: "DAIRY", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 50, MEDIUM: 100, LARGE: 150 }, kcalPer100: 174 },
  { key: "egg", name: "Ei", emoji: "🥚", category: "EGG", traits: [], unit: "GRAM", portions: { SMALL: 50, MEDIUM: 100, LARGE: 150 }, kcalPer100: 155 },
  { key: "chicken", name: "Hähnchen", emoji: "🍗", category: "MEAT", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 150, LARGE: 220 }, kcalPer100: 165 },
  { key: "turkey", name: "Putenbrust", emoji: "🍗", category: "MEAT", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 180, LARGE: 250 }, kcalPer100: 135 },
  { key: "beef", name: "Rindfleisch", emoji: "🥩", category: "MEAT", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 180, LARGE: 250 }, kcalPer100: 220 },
  { key: "lamb", name: "Lammfleisch", emoji: "🥩", category: "MEAT", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 180, LARGE: 250 }, kcalPer100: 250 },
  { key: "meat", name: "Fleisch", emoji: "🥩", category: "MEAT", traits: [], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 150, LARGE: 220 }, kcalPer100: 220 },
  { key: "fish", name: "Fisch", emoji: "🐟", category: "FISH_SEAFOOD", traits: ["HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 160, LARGE: 240 }, kcalPer100: 150 },
  { key: "salmon", name: "Lachsfilet", emoji: "🐟", category: "FISH_SEAFOOD", traits: ["HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 180, LARGE: 250 }, kcalPer100: 208 },
  { key: "sardines", name: "Sardinen", emoji: "🐟", category: "FISH_SEAFOOD", traits: ["HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 80, MEDIUM: 120, LARGE: 180 }, kcalPer100: 208 },
  { key: "mackerel", name: "Makrele", emoji: "🐟", category: "FISH_SEAFOOD", traits: ["HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 160, LARGE: 240 }, kcalPer100: 205 },
  { key: "tuna", name: "Thunfisch", emoji: "🐟", category: "FISH_SEAFOOD", traits: ["HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 150, LARGE: 220 }, kcalPer100: 116 },
  { key: "cod", name: "Kabeljau", emoji: "🐟", category: "FISH_SEAFOOD", traits: ["HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 180, LARGE: 250 }, kcalPer100: 82 },
  { key: "shrimp", name: "Garnelen", emoji: "🦐", category: "FISH_SEAFOOD", traits: ["HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 100, MEDIUM: 180, LARGE: 250 }, kcalPer100: 99 },
  { key: "olive-oil", name: "Olivenöl", emoji: "🫒", category: "FAT_OIL", traits: [], unit: "MILLILITER", portions: { SMALL: 5, MEDIUM: 10, LARGE: 15 }, kcalPer100: 820 },
  { key: "olives", name: "Oliven", emoji: "🫒", category: "FAT_OIL", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 25, MEDIUM: 50, LARGE: 80 }, kcalPer100: 145 },
  { key: "butter", name: "Butter", emoji: "🧈", category: "FAT_OIL", traits: [], unit: "GRAM", portions: { SMALL: 5, MEDIUM: 10, LARGE: 20 }, kcalPer100: 717 },
  { key: "pesto", name: "Basilikum-Pesto", emoji: "🌿", category: "CONDIMENT", traits: ["FERMENTED"], unit: "GRAM", portions: { SMALL: 15, MEDIUM: 30, LARGE: 50 }, kcalPer100: 450 },
  { key: "tzatziki", name: "Tzatziki", emoji: "🥒", category: "CONDIMENT", traits: ["FERMENTED", "HISTAMINE_RICH"], unit: "GRAM", portions: { SMALL: 50, MEDIUM: 100, LARGE: 150 }, kcalPer100: 120 },
  { key: "lemon-juice", name: "Zitronensaft", emoji: "🍋", category: "CONDIMENT", traits: [], unit: "MILLILITER", portions: { SMALL: 10, MEDIUM: 20, LARGE: 30 }, kcalPer100: 22 },
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

export function catalogFoodEnergyKcal(
  food: FoodCatalogItem,
  portion: keyof FoodCatalogItem["portions"],
): number {
  return Math.round((food.kcalPer100 * food.portions[portion]) / 100);
}
