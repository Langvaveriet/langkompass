import type {
  DietaryPattern,
  FoodCategory,
  FoodTrait,
  MealType,
  QuantityUnit,
} from "@/generated/prisma/enums";

export type CuratedRecipeItem = {
  name: string;
  category: FoodCategory;
  quantity: number;
  unit: QuantityUnit;
  energyKcal: number;
  traits?: FoodTrait[];
};

export type CuratedRecipe = {
  key: string;
  emoji: string;
  name: string;
  type: Exclude<MealType, "DRINK">;
  description: string;
  prepMinutes: number;
  servings: number;
  carbohydrateGrams: number;
  proteinGrams: number;
  fatGrams: number;
  dietaryPatterns: DietaryPattern[];
  items: CuratedRecipeItem[];
  instructions: string[];
};

const patterns: DietaryPattern[] = ["MEDITERRANEAN", "KETOGENIC"];
const fermented: FoodTrait[] = ["FERMENTED", "HISTAMINE_RICH"];
const fishTraits: FoodTrait[] = ["HISTAMINE_RICH"];

export const curatedRecipes: CuratedRecipe[] = [
  {
    key: "herb-omelette-spinach",
    emoji: "🍳",
    name: "Kräuteromelett mit Spinat",
    type: "BREAKFAST",
    description: "Schnelles Omelett mit Blattspinat, Kräutern und Olivenöl.",
    prepMinutes: 15,
    servings: 1,
    carbohydrateGrams: 5,
    proteinGrams: 25,
    fatGrams: 29,
    dietaryPatterns: patterns,
    items: [
      { name: "Eier", category: "EGG", quantity: 150, unit: "GRAM", energyKcal: 233 },
      { name: "Blattspinat", category: "VEGETABLE", quantity: 100, unit: "GRAM", energyKcal: 23 },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 10, unit: "MILLILITER", energyKcal: 82 },
      { name: "Frische Kräuter", category: "CONDIMENT", quantity: 10, unit: "GRAM", energyKcal: 3 },
    ],
    instructions: ["Spinat kurz in Olivenöl zusammenfallen lassen.", "Verquirlte Eier zugeben und bei milder Hitze stocken lassen.", "Mit Kräutern würzen und zusammenklappen."],
  },
  {
    key: "greek-yogurt-berries-walnuts",
    emoji: "🫐",
    name: "Griechischer Joghurt mit Beeren",
    type: "BREAKFAST",
    description: "Cremiges Frühstück mit Walnüssen und einer kleinen Portion Beeren.",
    prepMinutes: 5,
    servings: 1,
    carbohydrateGrams: 12,
    proteinGrams: 19,
    fatGrams: 28,
    dietaryPatterns: patterns,
    items: [
      { name: "Griechischer Joghurt", category: "DAIRY", quantity: 200, unit: "GRAM", energyKcal: 194, traits: fermented },
      { name: "Beeren", category: "FRUIT", quantity: 60, unit: "GRAM", energyKcal: 30 },
      { name: "Walnüsse", category: "NUT_SEED", quantity: 30, unit: "GRAM", energyKcal: 196, traits: ["HISTAMINE_LIBERATOR"] },
    ],
    instructions: ["Joghurt in eine Schale geben.", "Beeren und grob gehackte Walnüsse darauf verteilen."],
  },
  {
    key: "avocado-egg-bowl",
    emoji: "🥑",
    name: "Avocado-Ei-Bowl",
    type: "BREAKFAST",
    description: "Sättigende Bowl mit Ei, Avocado, Gurke und Kräutern.",
    prepMinutes: 12,
    servings: 1,
    carbohydrateGrams: 9,
    proteinGrams: 18,
    fatGrams: 35,
    dietaryPatterns: patterns,
    items: [
      { name: "Eier", category: "EGG", quantity: 100, unit: "GRAM", energyKcal: 155 },
      { name: "Avocado", category: "FRUIT", quantity: 150, unit: "GRAM", energyKcal: 240 },
      { name: "Gurke", category: "VEGETABLE", quantity: 100, unit: "GRAM", energyKcal: 15 },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 5, unit: "MILLILITER", energyKcal: 41 },
    ],
    instructions: ["Eier nach Wunsch kochen.", "Avocado und Gurke schneiden und mit Olivenöl mischen.", "Eier daraufgeben und würzen."],
  },
  {
    key: "feta-zucchini-eggs",
    emoji: "🥒",
    name: "Zucchini-Rührei mit Feta",
    type: "BREAKFAST",
    description: "Warmes Rührei mit Zucchini, Feta und Oregano.",
    prepMinutes: 15,
    servings: 1,
    carbohydrateGrams: 7,
    proteinGrams: 27,
    fatGrams: 31,
    dietaryPatterns: [...patterns, "VEGETARIAN"],
    items: [
      { name: "Eier", category: "EGG", quantity: 150, unit: "GRAM", energyKcal: 233 },
      { name: "Zucchini", category: "VEGETABLE", quantity: 150, unit: "GRAM", energyKcal: 26 },
      { name: "Feta", category: "DAIRY", quantity: 50, unit: "GRAM", energyKcal: 132, traits: fermented },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 8, unit: "MILLILITER", energyKcal: 66 },
    ],
    instructions: ["Zucchini in Olivenöl anbraten.", "Eier zugeben und cremig stocken lassen.", "Feta darüberbröseln und mit Oregano würzen."],
  },
  {
    key: "salmon-zucchini-pan",
    emoji: "🐟",
    name: "Lachs-Zucchini-Pfanne",
    type: "LUNCH",
    description: "Lachs mit Zucchini, Zitrone und mediterranen Kräutern.",
    prepMinutes: 25,
    servings: 1,
    carbohydrateGrams: 8,
    proteinGrams: 38,
    fatGrams: 32,
    dietaryPatterns: patterns,
    items: [
      { name: "Lachsfilet", category: "FISH_SEAFOOD", quantity: 180, unit: "GRAM", energyKcal: 374, traits: fishTraits },
      { name: "Zucchini", category: "VEGETABLE", quantity: 250, unit: "GRAM", energyKcal: 43 },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 12, unit: "MILLILITER", energyKcal: 98 },
      { name: "Zitrone", category: "FRUIT", quantity: 30, unit: "GRAM", energyKcal: 9 },
    ],
    instructions: ["Lachs in Olivenöl von beiden Seiten garen.", "Zucchini in derselben Pfanne anbraten.", "Mit Zitrone und Kräutern abschmecken."],
  },
  {
    key: "chicken-olive-salad",
    emoji: "🥗",
    name: "Hähnchen-Oliven-Salat",
    type: "LUNCH",
    description: "Knackiger Salat mit Hähnchen, Oliven und Zitronendressing.",
    prepMinutes: 25,
    servings: 1,
    carbohydrateGrams: 10,
    proteinGrams: 46,
    fatGrams: 29,
    dietaryPatterns: patterns,
    items: [
      { name: "Hähnchenbrust", category: "MEAT", quantity: 180, unit: "GRAM", energyKcal: 297 },
      { name: "Blattsalat", category: "VEGETABLE", quantity: 120, unit: "GRAM", energyKcal: 24 },
      { name: "Gurke", category: "VEGETABLE", quantity: 120, unit: "GRAM", energyKcal: 18 },
      { name: "Oliven", category: "FAT_OIL", quantity: 50, unit: "GRAM", energyKcal: 73, traits: fermented },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 15, unit: "MILLILITER", energyKcal: 123 },
    ],
    instructions: ["Hähnchen würzen und vollständig durchgaren.", "Salat, Gurke und Oliven mischen.", "Hähnchen auflegen und mit Olivenöl und Zitrone anmachen."],
  },
  {
    key: "tuna-avocado",
    emoji: "🥑",
    name: "Gefüllte Avocado mit Thunfisch",
    type: "LUNCH",
    description: "Avocado mit einer schnellen Thunfisch-Gurken-Füllung.",
    prepMinutes: 10,
    servings: 1,
    carbohydrateGrams: 10,
    proteinGrams: 34,
    fatGrams: 34,
    dietaryPatterns: patterns,
    items: [
      { name: "Avocado", category: "FRUIT", quantity: 180, unit: "GRAM", energyKcal: 288 },
      { name: "Thunfisch", category: "FISH_SEAFOOD", quantity: 150, unit: "GRAM", energyKcal: 174, traits: fishTraits },
      { name: "Gurke", category: "VEGETABLE", quantity: 80, unit: "GRAM", energyKcal: 12 },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 8, unit: "MILLILITER", energyKcal: 66 },
    ],
    instructions: ["Avocado halbieren und etwas Fruchtfleisch herauslösen.", "Thunfisch, Gurke und Avocadofleisch mischen.", "Abschmecken und in die Avocadohälften füllen."],
  },
  {
    key: "lamb-greek-salad",
    emoji: "🥩",
    name: "Lamm mit griechischem Salat",
    type: "LUNCH",
    description: "Gebratenes Lamm mit Gurke, Paprika, Oliven und Feta.",
    prepMinutes: 30,
    servings: 1,
    carbohydrateGrams: 12,
    proteinGrams: 43,
    fatGrams: 38,
    dietaryPatterns: patterns,
    items: [
      { name: "Lammfleisch", category: "MEAT", quantity: 180, unit: "GRAM", energyKcal: 396 },
      { name: "Gurke und Paprika", category: "VEGETABLE", quantity: 200, unit: "GRAM", energyKcal: 50 },
      { name: "Feta", category: "DAIRY", quantity: 40, unit: "GRAM", energyKcal: 106, traits: fermented },
      { name: "Oliven", category: "FAT_OIL", quantity: 35, unit: "GRAM", energyKcal: 51, traits: fermented },
    ],
    instructions: ["Lamm würzen und bis zum gewünschten Gargrad braten.", "Gemüse schneiden und mit Feta und Oliven mischen.", "Gemeinsam anrichten."],
  },
  {
    key: "shrimp-zucchini-noodles",
    emoji: "🍤",
    name: "Garnelen mit Zucchininudeln",
    type: "LUNCH",
    description: "Leichte Zucchininudeln mit Garnelen, Knoblauch und Olivenöl.",
    prepMinutes: 20,
    servings: 1,
    carbohydrateGrams: 11,
    proteinGrams: 40,
    fatGrams: 23,
    dietaryPatterns: patterns,
    items: [
      { name: "Garnelen", category: "FISH_SEAFOOD", quantity: 200, unit: "GRAM", energyKcal: 198, traits: fishTraits },
      { name: "Zucchini", category: "VEGETABLE", quantity: 300, unit: "GRAM", energyKcal: 51 },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 20, unit: "MILLILITER", energyKcal: 164 },
      { name: "Knoblauch", category: "CONDIMENT", quantity: 8, unit: "GRAM", energyKcal: 12 },
    ],
    instructions: ["Zucchini spiralisieren oder in feine Streifen schneiden.", "Garnelen mit Knoblauch in Olivenöl garen.", "Zucchini kurz unterschwenken und würzen."],
  },
  {
    key: "halloumi-avocado-salad",
    emoji: "🧀",
    name: "Halloumi-Avocado-Salat",
    type: "LUNCH",
    description: "Vegetarischer Salat mit gebratenem Halloumi und Avocado.",
    prepMinutes: 20,
    servings: 1,
    carbohydrateGrams: 13,
    proteinGrams: 25,
    fatGrams: 49,
    dietaryPatterns: [...patterns, "VEGETARIAN"],
    items: [
      { name: "Halloumi", category: "DAIRY", quantity: 120, unit: "GRAM", energyKcal: 386, traits: fermented },
      { name: "Avocado", category: "FRUIT", quantity: 120, unit: "GRAM", energyKcal: 192 },
      { name: "Blattsalat und Gurke", category: "VEGETABLE", quantity: 180, unit: "GRAM", energyKcal: 36 },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 8, unit: "MILLILITER", energyKcal: 66 },
    ],
    instructions: ["Halloumi in Scheiben goldbraun braten.", "Salat, Gurke und Avocado mischen.", "Halloumi daraufgeben und mit Olivenöl anmachen."],
  },
  {
    key: "chicken-ratatouille",
    emoji: "🍗",
    name: "Hähnchen auf Ratatouille",
    type: "DINNER",
    description: "Ofenhähnchen auf Zucchini, Aubergine und Paprika.",
    prepMinutes: 40,
    servings: 1,
    carbohydrateGrams: 15,
    proteinGrams: 48,
    fatGrams: 26,
    dietaryPatterns: patterns,
    items: [
      { name: "Hähnchenbrust", category: "MEAT", quantity: 200, unit: "GRAM", energyKcal: 330 },
      { name: "Zucchini, Aubergine und Paprika", category: "VEGETABLE", quantity: 300, unit: "GRAM", energyKcal: 90 },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 15, unit: "MILLILITER", energyKcal: 123 },
      { name: "Mediterrane Kräuter", category: "CONDIMENT", quantity: 5, unit: "GRAM", energyKcal: 2 },
    ],
    instructions: ["Gemüse würfeln, würzen und mit Olivenöl mischen.", "Hähnchen darauflegen.", "Bei 190 °C etwa 25 Minuten vollständig durchgaren."],
  },
  {
    key: "baked-feta-zucchini",
    emoji: "🍅",
    name: "Ofen-Feta mit Zucchini",
    type: "DINNER",
    description: "Vegetarisches Ofengericht mit Feta, Zucchini und wenigen Tomaten.",
    prepMinutes: 30,
    servings: 1,
    carbohydrateGrams: 13,
    proteinGrams: 24,
    fatGrams: 39,
    dietaryPatterns: [...patterns, "VEGETARIAN"],
    items: [
      { name: "Feta", category: "DAIRY", quantity: 150, unit: "GRAM", energyKcal: 398, traits: fermented },
      { name: "Zucchini", category: "VEGETABLE", quantity: 250, unit: "GRAM", energyKcal: 43 },
      { name: "Tomaten", category: "VEGETABLE", quantity: 100, unit: "GRAM", energyKcal: 18, traits: ["HISTAMINE_RICH"] },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 12, unit: "MILLILITER", energyKcal: 98 },
    ],
    instructions: ["Gemüse in eine Auflaufform geben.", "Feta auflegen und mit Olivenöl und Kräutern würzen.", "Bei 200 °C etwa 20 Minuten backen."],
  },
  {
    key: "cod-spinach-herbs",
    emoji: "🐟",
    name: "Kräuterkabeljau mit Spinat",
    type: "DINNER",
    description: "Milder Ofenfisch mit Blattspinat und Kräuteröl.",
    prepMinutes: 30,
    servings: 1,
    carbohydrateGrams: 7,
    proteinGrams: 43,
    fatGrams: 22,
    dietaryPatterns: patterns,
    items: [
      { name: "Kabeljau", category: "FISH_SEAFOOD", quantity: 220, unit: "GRAM", energyKcal: 180, traits: fishTraits },
      { name: "Blattspinat", category: "VEGETABLE", quantity: 250, unit: "GRAM", energyKcal: 58 },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 20, unit: "MILLILITER", energyKcal: 164 },
      { name: "Kräuter", category: "CONDIMENT", quantity: 10, unit: "GRAM", energyKcal: 3 },
    ],
    instructions: ["Fisch mit Kräutern und der Hälfte des Öls würzen.", "Bei 190 °C etwa 15 Minuten garen.", "Spinat im restlichen Öl zusammenfallen lassen und dazu servieren."],
  },
  {
    key: "eggplant-beef-pan",
    emoji: "🍆",
    name: "Auberginen-Hack-Pfanne",
    type: "DINNER",
    description: "Herzhafte Pfanne mit Rinderhack, Aubergine und mediterranen Gewürzen.",
    prepMinutes: 30,
    servings: 1,
    carbohydrateGrams: 14,
    proteinGrams: 42,
    fatGrams: 37,
    dietaryPatterns: patterns,
    items: [
      { name: "Rinderhackfleisch", category: "MEAT", quantity: 180, unit: "GRAM", energyKcal: 396 },
      { name: "Aubergine", category: "VEGETABLE", quantity: 250, unit: "GRAM", energyKcal: 63 },
      { name: "Paprika", category: "VEGETABLE", quantity: 100, unit: "GRAM", energyKcal: 31 },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 12, unit: "MILLILITER", energyKcal: 98 },
    ],
    instructions: ["Hackfleisch krümelig anbraten.", "Gewürfeltes Gemüse und Olivenöl zugeben.", "Bei mittlerer Hitze weich garen und mediterran würzen."],
  },
  {
    key: "turkey-pesto-zucchini",
    emoji: "🌿",
    name: "Putenstreifen mit Pesto-Zucchini",
    type: "DINNER",
    description: "Putenstreifen mit Zucchini und einem schnellen Basilikum-Pesto.",
    prepMinutes: 25,
    servings: 1,
    carbohydrateGrams: 9,
    proteinGrams: 47,
    fatGrams: 31,
    dietaryPatterns: patterns,
    items: [
      { name: "Putenbrust", category: "MEAT", quantity: 200, unit: "GRAM", energyKcal: 270 },
      { name: "Zucchini", category: "VEGETABLE", quantity: 250, unit: "GRAM", energyKcal: 43 },
      { name: "Basilikum-Pesto", category: "CONDIMENT", quantity: 40, unit: "GRAM", energyKcal: 180, traits: fermented },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 8, unit: "MILLILITER", energyKcal: 66 },
    ],
    instructions: ["Putenstreifen vollständig durchgaren.", "Zucchini separat anbraten.", "Pesto unter die Zucchini rühren und mit der Pute servieren."],
  },
  {
    key: "meatballs-cauliflower",
    emoji: "🧆",
    name: "Kräuterhackbällchen mit Blumenkohl",
    type: "DINNER",
    description: "Saftige Hackbällchen mit Kräutern und gebratenem Blumenkohl.",
    prepMinutes: 35,
    servings: 1,
    carbohydrateGrams: 13,
    proteinGrams: 43,
    fatGrams: 39,
    dietaryPatterns: patterns,
    items: [
      { name: "Rinderhackfleisch", category: "MEAT", quantity: 180, unit: "GRAM", energyKcal: 396 },
      { name: "Blumenkohl", category: "VEGETABLE", quantity: 300, unit: "GRAM", energyKcal: 75 },
      { name: "Ei", category: "EGG", quantity: 50, unit: "GRAM", energyKcal: 78 },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 12, unit: "MILLILITER", energyKcal: 98 },
    ],
    instructions: ["Hack mit Ei und Kräutern mischen und Bällchen formen.", "Bällchen vollständig durchbraten.", "Blumenkohl klein schneiden und in Olivenöl goldbraun garen."],
  },
  {
    key: "olives-almonds",
    emoji: "🫒",
    name: "Oliven und Mandeln",
    type: "SNACK",
    description: "Ein kleiner mediterraner Snack ohne Zubereitung.",
    prepMinutes: 2,
    servings: 1,
    carbohydrateGrams: 5,
    proteinGrams: 7,
    fatGrams: 22,
    dietaryPatterns: [...patterns, "VEGETARIAN"],
    items: [
      { name: "Oliven", category: "FAT_OIL", quantity: 50, unit: "GRAM", energyKcal: 73, traits: fermented },
      { name: "Mandeln", category: "NUT_SEED", quantity: 30, unit: "GRAM", energyKcal: 174, traits: ["HISTAMINE_LIBERATOR"] },
    ],
    instructions: ["Oliven und Mandeln portionsweise anrichten."],
  },
  {
    key: "cucumber-feta-bites",
    emoji: "🥒",
    name: "Gurken-Feta-Happen",
    type: "SNACK",
    description: "Frische Gurkenscheiben mit Feta und Oregano.",
    prepMinutes: 8,
    servings: 1,
    carbohydrateGrams: 5,
    proteinGrams: 10,
    fatGrams: 18,
    dietaryPatterns: [...patterns, "VEGETARIAN"],
    items: [
      { name: "Gurke", category: "VEGETABLE", quantity: 180, unit: "GRAM", energyKcal: 27 },
      { name: "Feta", category: "DAIRY", quantity: 70, unit: "GRAM", energyKcal: 186, traits: fermented },
      { name: "Olivenöl", category: "FAT_OIL", quantity: 5, unit: "MILLILITER", energyKcal: 41 },
    ],
    instructions: ["Gurke in dicke Scheiben schneiden.", "Feta darauf verteilen und mit Oregano und Olivenöl würzen."],
  },
  {
    key: "egg-avocado-snack",
    emoji: "🥚",
    name: "Ei mit Avocado",
    type: "SNACK",
    description: "Ein unkomplizierter Snack aus gekochtem Ei und Avocado.",
    prepMinutes: 10,
    servings: 1,
    carbohydrateGrams: 5,
    proteinGrams: 10,
    fatGrams: 22,
    dietaryPatterns: [...patterns, "VEGETARIAN"],
    items: [
      { name: "Ei", category: "EGG", quantity: 50, unit: "GRAM", energyKcal: 78 },
      { name: "Avocado", category: "FRUIT", quantity: 100, unit: "GRAM", energyKcal: 160 },
      { name: "Zitronensaft", category: "CONDIMENT", quantity: 10, unit: "MILLILITER", energyKcal: 2 },
    ],
    instructions: ["Ei kochen und halbieren.", "Avocado schneiden, mit Zitronensaft beträufeln und gemeinsam anrichten."],
  },
  {
    key: "yogurt-walnut-snack",
    emoji: "🥣",
    name: "Joghurt mit Walnüssen und Zimt",
    type: "SNACK",
    description: "Kleine Joghurtportion mit Walnüssen und Zimt.",
    prepMinutes: 3,
    servings: 1,
    carbohydrateGrams: 7,
    proteinGrams: 11,
    fatGrams: 20,
    dietaryPatterns: [...patterns, "VEGETARIAN"],
    items: [
      { name: "Griechischer Joghurt", category: "DAIRY", quantity: 150, unit: "GRAM", energyKcal: 146, traits: fermented },
      { name: "Walnüsse", category: "NUT_SEED", quantity: 25, unit: "GRAM", energyKcal: 164, traits: ["HISTAMINE_LIBERATOR"] },
      { name: "Zimt", category: "CONDIMENT", quantity: 2, unit: "GRAM", energyKcal: 5 },
    ],
    instructions: ["Joghurt mit Walnüssen und Zimt anrichten."],
  },
];

export const curatedRecipesByKey = new Map(
  curatedRecipes.map((recipe) => [recipe.key, recipe]),
);

function seedNumber(seed: string): number {
  return [...seed].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    2166136261,
  );
}

export function suggestedCuratedRecipe(
  seed: string,
  type?: CuratedRecipe["type"],
): CuratedRecipe {
  const candidates = type
    ? curatedRecipes.filter((recipe) => recipe.type === type)
    : curatedRecipes;

  return candidates[seedNumber(seed) % candidates.length];
}
