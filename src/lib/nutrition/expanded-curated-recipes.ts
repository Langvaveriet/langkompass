import type {
  DietaryPattern,
  FoodCategory,
  FoodTrait,
  QuantityUnit,
} from "@/generated/prisma/enums";
import type { CuratedRecipe, CuratedRecipeItem } from "./curated-recipes";

type IngredientDefinition = {
  name: string;
  category: FoodCategory;
  unit?: QuantityUnit;
  kcal: number;
  carbohydrate: number;
  protein: number;
  fat: number;
  traits?: FoodTrait[];
};

const ingredientCatalog = {
  almondButter: { name: "Mandelmus", category: "NUT_SEED", kcal: 614, carbohydrate: 6, protein: 21, fat: 56 },
  almonds: { name: "Mandeln", category: "NUT_SEED", kcal: 579, carbohydrate: 6, protein: 21, fat: 50, traits: ["HISTAMINE_LIBERATOR"] },
  artichoke: { name: "Artischockenherzen", category: "VEGETABLE", kcal: 47, carbohydrate: 6, protein: 3, fat: 0.2 },
  asparagus: { name: "Grüner Spargel", category: "VEGETABLE", kcal: 20, carbohydrate: 2, protein: 2.2, fat: 0.1 },
  avocado: { name: "Avocado", category: "FRUIT", kcal: 160, carbohydrate: 2, protein: 2, fat: 15 },
  beef: { name: "Rindfleisch", category: "MEAT", kcal: 220, carbohydrate: 0, protein: 26, fat: 13 },
  berries: { name: "Beeren", category: "FRUIT", kcal: 50, carbohydrate: 8, protein: 1, fat: 0.5 },
  broccoli: { name: "Brokkoli", category: "VEGETABLE", kcal: 34, carbohydrate: 4, protein: 2.8, fat: 0.4 },
  butter: { name: "Butter", category: "FAT_OIL", kcal: 717, carbohydrate: 0.1, protein: 0.9, fat: 81 },
  cabbage: { name: "Weißkohl", category: "VEGETABLE", kcal: 25, carbohydrate: 4, protein: 1.3, fat: 0.1 },
  cacao: { name: "Backkakao", category: "CONDIMENT", kcal: 350, carbohydrate: 14, protein: 20, fat: 22 },
  cauliflower: { name: "Blumenkohl", category: "VEGETABLE", kcal: 25, carbohydrate: 3, protein: 1.9, fat: 0.3 },
  celery: { name: "Staudensellerie", category: "VEGETABLE", kcal: 16, carbohydrate: 2, protein: 0.7, fat: 0.2 },
  chia: { name: "Chiasamen", category: "NUT_SEED", kcal: 486, carbohydrate: 8, protein: 17, fat: 31 },
  chicken: { name: "Hähnchenbrust", category: "MEAT", kcal: 165, carbohydrate: 0, protein: 31, fat: 3.6 },
  cod: { name: "Kabeljau", category: "FISH_SEAFOOD", kcal: 82, carbohydrate: 0, protein: 18, fat: 0.7, traits: ["HISTAMINE_RICH"] },
  coconut: { name: "Kokosraspel", category: "NUT_SEED", kcal: 660, carbohydrate: 7, protein: 7, fat: 65 },
  coconutMilk: { name: "Kokosmilch", category: "FAT_OIL", unit: "MILLILITER", kcal: 190, carbohydrate: 3, protein: 2, fat: 19 },
  cottageCheese: { name: "Hüttenkäse", category: "DAIRY", kcal: 98, carbohydrate: 3, protein: 12, fat: 4.3, traits: ["FERMENTED", "HISTAMINE_RICH"] },
  cucumber: { name: "Gurke", category: "VEGETABLE", kcal: 15, carbohydrate: 2, protein: 0.7, fat: 0.1 },
  egg: { name: "Ei", category: "EGG", kcal: 155, carbohydrate: 1.1, protein: 13, fat: 11 },
  eggplant: { name: "Aubergine", category: "VEGETABLE", kcal: 25, carbohydrate: 4, protein: 1, fat: 0.2 },
  feta: { name: "Feta", category: "DAIRY", kcal: 265, carbohydrate: 4, protein: 14, fat: 21, traits: ["FERMENTED", "HISTAMINE_RICH"] },
  flaxseed: { name: "Leinsamen", category: "NUT_SEED", kcal: 534, carbohydrate: 2, protein: 18, fat: 42 },
  garlic: { name: "Knoblauch", category: "CONDIMENT", kcal: 149, carbohydrate: 28, protein: 6.4, fat: 0.5 },
  goatCheese: { name: "Ziegenkäse", category: "DAIRY", kcal: 364, carbohydrate: 1, protein: 22, fat: 30, traits: ["FERMENTED", "HISTAMINE_RICH"] },
  greenBeans: { name: "Grüne Bohnen", category: "VEGETABLE", kcal: 31, carbohydrate: 5, protein: 1.8, fat: 0.1 },
  halloumi: { name: "Halloumi", category: "DAIRY", kcal: 322, carbohydrate: 2, protein: 22, fat: 26, traits: ["FERMENTED", "HISTAMINE_RICH"] },
  herbs: { name: "Frische Kräuter", category: "CONDIMENT", kcal: 30, carbohydrate: 3, protein: 3, fat: 0.5 },
  lamb: { name: "Lammfleisch", category: "MEAT", kcal: 250, carbohydrate: 0, protein: 25, fat: 17 },
  lemon: { name: "Zitronensaft", category: "CONDIMENT", unit: "MILLILITER", kcal: 22, carbohydrate: 7, protein: 0.4, fat: 0.2 },
  lettuce: { name: "Blattsalat", category: "VEGETABLE", kcal: 20, carbohydrate: 2, protein: 1.4, fat: 0.2 },
  mascarpone: { name: "Mascarpone", category: "DAIRY", kcal: 420, carbohydrate: 4, protein: 5, fat: 42, traits: ["FERMENTED", "HISTAMINE_RICH"] },
  mozzarella: { name: "Mozzarella", category: "DAIRY", kcal: 250, carbohydrate: 2, protein: 18, fat: 19, traits: ["FERMENTED", "HISTAMINE_RICH"] },
  mushrooms: { name: "Champignons", category: "VEGETABLE", kcal: 22, carbohydrate: 2, protein: 3.1, fat: 0.3 },
  oliveOil: { name: "Olivenöl", category: "FAT_OIL", unit: "MILLILITER", kcal: 820, carbohydrate: 0, protein: 0, fat: 91 },
  olives: { name: "Oliven", category: "FAT_OIL", kcal: 145, carbohydrate: 4, protein: 1, fat: 15, traits: ["FERMENTED", "HISTAMINE_RICH"] },
  pepper: { name: "Paprika", category: "VEGETABLE", kcal: 31, carbohydrate: 5, protein: 1, fat: 0.3 },
  pumpkinSeeds: { name: "Kürbiskerne", category: "NUT_SEED", kcal: 559, carbohydrate: 4, protein: 30, fat: 49 },
  radish: { name: "Radieschen", category: "VEGETABLE", kcal: 16, carbohydrate: 2, protein: 0.7, fat: 0.1 },
  ricotta: { name: "Ricotta", category: "DAIRY", kcal: 174, carbohydrate: 3, protein: 11, fat: 13, traits: ["FERMENTED", "HISTAMINE_RICH"] },
  salmon: { name: "Lachsfilet", category: "FISH_SEAFOOD", kcal: 208, carbohydrate: 0, protein: 20, fat: 13, traits: ["HISTAMINE_RICH"] },
  sardines: { name: "Sardinen", category: "FISH_SEAFOOD", kcal: 208, carbohydrate: 0, protein: 25, fat: 11, traits: ["HISTAMINE_RICH"] },
  shrimp: { name: "Garnelen", category: "FISH_SEAFOOD", kcal: 99, carbohydrate: 0.2, protein: 24, fat: 0.3, traits: ["HISTAMINE_RICH"] },
  skyr: { name: "Skyr natur", category: "DAIRY", kcal: 63, carbohydrate: 4, protein: 11, fat: 0.2, traits: ["FERMENTED", "HISTAMINE_RICH"] },
  spinach: { name: "Blattspinat", category: "VEGETABLE", kcal: 23, carbohydrate: 1.4, protein: 2.9, fat: 0.4 },
  tahini: { name: "Tahin", category: "NUT_SEED", kcal: 595, carbohydrate: 12, protein: 17, fat: 54 },
  tomato: { name: "Tomaten", category: "VEGETABLE", kcal: 18, carbohydrate: 2.6, protein: 0.9, fat: 0.2, traits: ["HISTAMINE_RICH"] },
  tuna: { name: "Thunfisch", category: "FISH_SEAFOOD", kcal: 116, carbohydrate: 0, protein: 26, fat: 1, traits: ["HISTAMINE_RICH"] },
  turkey: { name: "Putenbrust", category: "MEAT", kcal: 135, carbohydrate: 0, protein: 29, fat: 1.6 },
  walnuts: { name: "Walnüsse", category: "NUT_SEED", kcal: 654, carbohydrate: 7, protein: 15, fat: 65, traits: ["HISTAMINE_LIBERATOR"] },
  yogurt: { name: "Griechischer Joghurt", category: "DAIRY", kcal: 97, carbohydrate: 4, protein: 9, fat: 5, traits: ["FERMENTED", "HISTAMINE_RICH"] },
  zucchini: { name: "Zucchini", category: "VEGETABLE", kcal: 17, carbohydrate: 2.2, protein: 1.2, fat: 0.3 },
} satisfies Record<string, IngredientDefinition>;

type IngredientKey = keyof typeof ingredientCatalog;
type IngredientAmount = readonly [IngredientKey, number];
type PreparationStyle = "bowl" | "cold" | "oven" | "pan";

function preparedItem([key, quantity]: IngredientAmount): CuratedRecipeItem {
  const ingredient: IngredientDefinition = ingredientCatalog[key];
  return {
    foodKey: key,
    name: ingredient.name,
    category: ingredient.category,
    quantity,
    unit: ingredient.unit ?? "GRAM",
    energyKcal: Math.round((ingredient.kcal * quantity) / 100),
    traits: ingredient.traits,
  };
}

function macroTotal(
  ingredients: readonly IngredientAmount[],
  nutrient: "carbohydrate" | "protein" | "fat",
): number {
  return Math.round(
    ingredients.reduce(
      (sum, [key, quantity]) =>
        sum + (ingredientCatalog[key][nutrient] * quantity) / 100,
      0,
    ),
  );
}

function preparation(style: PreparationStyle): string[] {
  if (style === "cold") {
    return [
      "Alle Zutaten mundgerecht vorbereiten.",
      "Mischen, mit Kräutern abschmecken und frisch servieren.",
    ];
  }
  if (style === "bowl") {
    return [
      "Die Zutaten vorbereiten und in einer Schale anrichten.",
      "Mit Gewürzen nach Geschmack abrunden und direkt servieren.",
    ];
  }
  if (style === "oven") {
    return [
      "Die Zutaten vorbereiten, würzen und in eine kleine Auflaufform geben.",
      "Bei 190 °C vollständig garen und vor dem Servieren kurz ruhen lassen.",
    ];
  }
  return [
    "Die Zutaten vorbereiten und nacheinander in einer Pfanne garen.",
    "Alles zusammenführen, abschmecken und vollständig gegart servieren.",
  ];
}

function recipe(input: {
  key: string;
  emoji: string;
  name: string;
  type: CuratedRecipe["type"];
  description: string;
  prepMinutes: number;
  ingredients: readonly IngredientAmount[];
  style: PreparationStyle;
  vegetarian?: boolean;
}): CuratedRecipe {
  const dietaryPatterns: DietaryPattern[] = [
    "MEDITERRANEAN",
    "KETOGENIC",
    ...(input.vegetarian ? ["VEGETARIAN" as const] : []),
  ];
  return {
    key: input.key,
    emoji: input.emoji,
    name: input.name,
    type: input.type,
    description: input.description,
    prepMinutes: input.prepMinutes,
    servings: 1,
    carbohydrateGrams: macroTotal(input.ingredients, "carbohydrate"),
    proteinGrams: macroTotal(input.ingredients, "protein"),
    fatGrams: macroTotal(input.ingredients, "fat"),
    dietaryPatterns,
    items: input.ingredients.map(preparedItem),
    instructions: preparation(input.style),
  };
}

const breakfastRecipes: CuratedRecipe[] = [
  recipe({ key: "mushroom-goat-cheese-omelette", emoji: "🍄", name: "Pilzomelett mit Ziegenkäse", type: "BREAKFAST", description: "Herzhaftes Omelett mit Champignons, Ziegenkäse und Kräutern.", prepMinutes: 15, ingredients: [["egg", 150], ["mushrooms", 120], ["goatCheese", 40], ["oliveOil", 8]], style: "pan", vegetarian: true }),
  recipe({ key: "pepper-feta-scramble", emoji: "🍳", name: "Paprika-Rührei mit Feta", type: "BREAKFAST", description: "Cremiges Rührei mit Paprika, Feta und mediterranen Kräutern.", prepMinutes: 12, ingredients: [["egg", 150], ["pepper", 120], ["feta", 45], ["oliveOil", 7]], style: "pan", vegetarian: true }),
  recipe({ key: "broccoli-egg-muffins", emoji: "🧁", name: "Brokkoli-Ei-Muffins", type: "BREAKFAST", description: "Kleine herzhafte Eiermuffins mit Brokkoli und Mozzarella.", prepMinutes: 25, ingredients: [["egg", 150], ["broccoli", 100], ["mozzarella", 45]], style: "oven", vegetarian: true }),
  recipe({ key: "baked-eggs-avocado", emoji: "🥑", name: "Ofeneier mit Avocado", type: "BREAKFAST", description: "Warme Ofeneier mit Avocado und einem frischen Kräuterabschluss.", prepMinutes: 20, ingredients: [["egg", 100], ["avocado", 140], ["herbs", 10]], style: "oven", vegetarian: true }),
  recipe({ key: "chia-coconut-pudding", emoji: "🥥", name: "Chia-Kokos-Pudding", type: "BREAKFAST", description: "Sämiger Chia-Pudding mit Kokosmilch und wenigen Beeren.", prepMinutes: 8, ingredients: [["chia", 30], ["coconutMilk", 160], ["berries", 50]], style: "bowl", vegetarian: true }),
  recipe({ key: "flax-yogurt-cream", emoji: "🥣", name: "Leinsamen-Joghurt-Creme", type: "BREAKFAST", description: "Griechischer Joghurt mit Leinsamen, Mandeln und Zimt.", prepMinutes: 5, ingredients: [["yogurt", 180], ["flaxseed", 25], ["almonds", 20]], style: "bowl", vegetarian: true }),
  recipe({ key: "ricotta-almond-bowl", emoji: "🌰", name: "Ricotta-Mandel-Bowl", type: "BREAKFAST", description: "Milde Ricottacreme mit Mandeln und einer kleinen Beerenportion.", prepMinutes: 5, ingredients: [["ricotta", 170], ["almonds", 25], ["berries", 45]], style: "bowl", vegetarian: true }),
  recipe({ key: "cottage-cucumber-breakfast", emoji: "🥒", name: "Hüttenkäse mit Gurke", type: "BREAKFAST", description: "Frisches herzhaftes Frühstück mit Hüttenkäse, Gurke und Kräutern.", prepMinutes: 6, ingredients: [["cottageCheese", 200], ["cucumber", 160], ["herbs", 12], ["oliveOil", 5]], style: "cold", vegetarian: true }),
  recipe({ key: "salmon-avocado-breakfast", emoji: "🐟", name: "Lachs-Avocado-Frühstück", type: "BREAKFAST", description: "Proteinreiches Frühstück mit Lachs, Avocado und Gurke.", prepMinutes: 15, ingredients: [["salmon", 110], ["avocado", 100], ["cucumber", 100], ["lemon", 10]], style: "pan" }),
  recipe({ key: "tuna-egg-breakfast-bowl", emoji: "🥚", name: "Thunfisch-Ei-Bowl", type: "BREAKFAST", description: "Sättigende Frühstücksschale mit Ei, Thunfisch und Gurke.", prepMinutes: 12, ingredients: [["tuna", 100], ["egg", 100], ["cucumber", 120], ["oliveOil", 7]], style: "bowl" }),
  recipe({ key: "zucchini-egg-pancakes", emoji: "🥞", name: "Zucchini-Ei-Puffer", type: "BREAKFAST", description: "Herzhafte Frühstückspuffer aus Zucchini, Ei und Feta.", prepMinutes: 18, ingredients: [["zucchini", 180], ["egg", 100], ["feta", 40], ["oliveOil", 8]], style: "pan", vegetarian: true }),
  recipe({ key: "cauliflower-egg-hash", emoji: "🥦", name: "Blumenkohl-Ei-Pfanne", type: "BREAKFAST", description: "Würzige Frühstückspfanne mit Blumenkohl, Ei und Kräutern.", prepMinutes: 18, ingredients: [["cauliflower", 200], ["egg", 100], ["herbs", 10], ["oliveOil", 10]], style: "pan", vegetarian: true }),
  recipe({ key: "asparagus-egg-plate", emoji: "🌱", name: "Spargel mit weichem Ei", type: "BREAKFAST", description: "Grüner Spargel mit weich gegartem Ei und Zitronenöl.", prepMinutes: 18, ingredients: [["asparagus", 200], ["egg", 100], ["oliveOil", 10], ["lemon", 10]], style: "pan", vegetarian: true }),
  recipe({ key: "mozzarella-tomato-eggs", emoji: "🍅", name: "Tomaten-Eier mit Mozzarella", type: "BREAKFAST", description: "Mediterrane Eierpfanne mit Tomaten, Mozzarella und Basilikum.", prepMinutes: 15, ingredients: [["egg", 150], ["tomato", 120], ["mozzarella", 50], ["oliveOil", 7]], style: "pan", vegetarian: true }),
  recipe({ key: "keto-shakshuka", emoji: "🍅", name: "Kleine Keto-Shakshuka", type: "BREAKFAST", description: "Eier in einer kompakten Paprika-Tomaten-Pfanne mit Kräutern.", prepMinutes: 20, ingredients: [["egg", 150], ["pepper", 100], ["tomato", 100], ["oliveOil", 10]], style: "pan", vegetarian: true }),
  recipe({ key: "almond-coconut-porridge", emoji: "🥥", name: "Mandel-Kokos-Porridge", type: "BREAKFAST", description: "Warmes getreidefreies Porridge aus Mandeln, Kokos und Leinsamen.", prepMinutes: 10, ingredients: [["almonds", 35], ["coconut", 25], ["flaxseed", 20], ["coconutMilk", 120]], style: "pan", vegetarian: true }),
  recipe({ key: "cacao-chia-cream", emoji: "🍫", name: "Kakao-Chia-Creme", type: "BREAKFAST", description: "Ungesüßte Chia-Creme mit Kakao, Kokosmilch und Walnüssen.", prepMinutes: 7, ingredients: [["chia", 30], ["cacao", 8], ["coconutMilk", 150], ["walnuts", 18]], style: "bowl", vegetarian: true }),
  recipe({ key: "berry-mascarpone-bowl", emoji: "🫐", name: "Beeren-Mascarpone-Bowl", type: "BREAKFAST", description: "Cremige Mascarpone-Schale mit Beeren und Leinsamen.", prepMinutes: 5, ingredients: [["mascarpone", 100], ["berries", 60], ["flaxseed", 18]], style: "bowl", vegetarian: true }),
  recipe({ key: "walnut-ricotta-cream", emoji: "🌰", name: "Walnuss-Ricotta-Creme", type: "BREAKFAST", description: "Schnelle Ricottacreme mit Walnüssen und einer Spur Kakao.", prepMinutes: 5, ingredients: [["ricotta", 170], ["walnuts", 25], ["cacao", 5]], style: "bowl", vegetarian: true }),
  recipe({ key: "avocado-cottage-bowl", emoji: "🥑", name: "Avocado-Hüttenkäse-Bowl", type: "BREAKFAST", description: "Herzhafte Bowl mit Avocado, Hüttenkäse, Gurke und Kräutern.", prepMinutes: 7, ingredients: [["avocado", 120], ["cottageCheese", 180], ["cucumber", 100], ["herbs", 8]], style: "bowl", vegetarian: true }),
  recipe({ key: "egg-salad-lettuce-breakfast", emoji: "🥬", name: "Eiersalat in Salatblättern", type: "BREAKFAST", description: "Leichter Eiersalat mit Avocado in knackigen Salatblättern.", prepMinutes: 12, ingredients: [["egg", 120], ["avocado", 80], ["lettuce", 80], ["lemon", 10]], style: "cold", vegetarian: true }),
  recipe({ key: "turkey-avocado-breakfast", emoji: "🍗", name: "Pute-Avocado-Frühstücksteller", type: "BREAKFAST", description: "Herzhafter Frühstücksteller mit Pute, Avocado und Radieschen.", prepMinutes: 15, ingredients: [["turkey", 130], ["avocado", 100], ["radish", 100], ["oliveOil", 6]], style: "pan" }),
  recipe({ key: "sardine-cucumber-breakfast", emoji: "🐟", name: "Sardinen-Gurken-Teller", type: "BREAKFAST", description: "Mediterraner Frühstücksteller mit Sardinen, Gurke und Ei.", prepMinutes: 10, ingredients: [["sardines", 90], ["cucumber", 150], ["egg", 60], ["lemon", 10]], style: "cold" }),
  recipe({ key: "halloumi-spinach-breakfast", emoji: "🧀", name: "Halloumi-Spinat-Frühstück", type: "BREAKFAST", description: "Gebratener Halloumi mit Blattspinat und einem weichen Ei.", prepMinutes: 16, ingredients: [["halloumi", 90], ["spinach", 150], ["egg", 60], ["oliveOil", 5]], style: "pan", vegetarian: true }),
  recipe({ key: "pumpkin-yogurt-bowl", emoji: "🥣", name: "Joghurt mit Kürbiskernen", type: "BREAKFAST", description: "Griechischer Joghurt mit Kürbiskernen, Chia und wenigen Beeren.", prepMinutes: 4, ingredients: [["yogurt", 180], ["pumpkinSeeds", 25], ["chia", 15], ["berries", 40]], style: "bowl", vegetarian: true }),
  recipe({ key: "keto-nut-muesli", emoji: "🌰", name: "Keto-Nuss-Müsli", type: "BREAKFAST", description: "Knusprige Mischung aus Mandeln, Walnüssen, Kokos und Joghurt.", prepMinutes: 5, ingredients: [["almonds", 25], ["walnuts", 20], ["coconut", 15], ["yogurt", 150]], style: "bowl", vegetarian: true }),
];

const lunchRecipes: CuratedRecipe[] = [
  recipe({ key: "greek-chicken-bowl", emoji: "🥗", name: "Griechische Hähnchen-Bowl", type: "LUNCH", description: "Hähnchen mit Gurke, Feta, Oliven und knackigem Salat.", prepMinutes: 25, ingredients: [["chicken", 180], ["cucumber", 140], ["lettuce", 100], ["feta", 45], ["olives", 35], ["oliveOil", 10]], style: "bowl" }),
  recipe({ key: "turkey-zucchini-lunch", emoji: "🍗", name: "Puten-Zucchini-Pfanne", type: "LUNCH", description: "Schnelle Putenpfanne mit Zucchini, Paprika und Kräutern.", prepMinutes: 22, ingredients: [["turkey", 190], ["zucchini", 220], ["pepper", 100], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "beef-broccoli-lunch", emoji: "🥦", name: "Rind mit Brokkoli", type: "LUNCH", description: "Herzhafte Rindfleischpfanne mit Brokkoli und Knoblauch.", prepMinutes: 25, ingredients: [["beef", 180], ["broccoli", 250], ["garlic", 6], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "lamb-cauliflower-bowl", emoji: "🥩", name: "Lamm-Blumenkohl-Bowl", type: "LUNCH", description: "Gewürztes Lamm auf geröstetem Blumenkohl mit Tahin.", prepMinutes: 30, ingredients: [["lamb", 170], ["cauliflower", 260], ["tahini", 25], ["lemon", 10]], style: "pan" }),
  recipe({ key: "cod-cucumber-salad", emoji: "🐟", name: "Kabeljau-Gurken-Salat", type: "LUNCH", description: "Milder Kabeljau mit Gurke, Blattsalat und Zitronenöl.", prepMinutes: 22, ingredients: [["cod", 200], ["cucumber", 160], ["lettuce", 100], ["oliveOil", 15], ["lemon", 12]], style: "pan" }),
  recipe({ key: "salmon-asparagus-lunch", emoji: "🌱", name: "Lachs mit grünem Spargel", type: "LUNCH", description: "Gebratener Lachs mit grünem Spargel und Zitronenkräutern.", prepMinutes: 25, ingredients: [["salmon", 180], ["asparagus", 250], ["oliveOil", 10], ["lemon", 12]], style: "pan" }),
  recipe({ key: "shrimp-avocado-salad", emoji: "🍤", name: "Garnelen-Avocado-Salat", type: "LUNCH", description: "Frischer Salat mit Garnelen, Avocado, Gurke und Kräutern.", prepMinutes: 18, ingredients: [["shrimp", 180], ["avocado", 120], ["cucumber", 140], ["lettuce", 80], ["oliveOil", 10]], style: "pan" }),
  recipe({ key: "tuna-lettuce-wraps", emoji: "🥬", name: "Thunfisch-Salat-Wraps", type: "LUNCH", description: "Knackige Salatblätter mit Thunfisch, Avocado und Gurke.", prepMinutes: 10, ingredients: [["tuna", 150], ["lettuce", 100], ["avocado", 110], ["cucumber", 100], ["lemon", 10]], style: "cold" }),
  recipe({ key: "sardine-mediterranean-salad", emoji: "🐟", name: "Mediterraner Sardinensalat", type: "LUNCH", description: "Sardinensalat mit Paprika, Gurke, Oliven und Blattsalat.", prepMinutes: 10, ingredients: [["sardines", 130], ["pepper", 100], ["cucumber", 120], ["olives", 30], ["lettuce", 80]], style: "cold" }),
  recipe({ key: "chicken-feta-zucchini", emoji: "🍗", name: "Hähnchen mit Feta-Zucchini", type: "LUNCH", description: "Gebratene Hähnchenbrust mit Zucchini, Feta und Oregano.", prepMinutes: 25, ingredients: [["chicken", 190], ["zucchini", 250], ["feta", 50], ["oliveOil", 10]], style: "pan" }),
  recipe({ key: "turkey-eggplant-lunch", emoji: "🍆", name: "Pute mit Aubergine", type: "LUNCH", description: "Mediterrane Putenpfanne mit Aubergine, Paprika und Kräutern.", prepMinutes: 28, ingredients: [["turkey", 190], ["eggplant", 230], ["pepper", 100], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "beef-stuffed-pepper", emoji: "🫑", name: "Paprika mit Rindfüllung", type: "LUNCH", description: "Ofenpaprika mit würziger Rindfleisch-Zucchini-Füllung.", prepMinutes: 35, ingredients: [["beef", 170], ["pepper", 200], ["zucchini", 100], ["mozzarella", 40]], style: "oven" }),
  recipe({ key: "halloumi-broccoli-bowl", emoji: "🥦", name: "Halloumi-Brokkoli-Bowl", type: "LUNCH", description: "Vegetarische Bowl mit Halloumi, Brokkoli, Gurke und Tahin.", prepMinutes: 20, ingredients: [["halloumi", 120], ["broccoli", 220], ["cucumber", 100], ["tahini", 20]], style: "pan", vegetarian: true }),
  recipe({ key: "feta-cauliflower-bowl", emoji: "🧀", name: "Feta-Blumenkohl-Bowl", type: "LUNCH", description: "Gerösteter Blumenkohl mit Feta, Oliven und Zitronenöl.", prepMinutes: 28, ingredients: [["cauliflower", 280], ["feta", 100], ["olives", 35], ["oliveOil", 12], ["lemon", 10]], style: "oven", vegetarian: true }),
  recipe({ key: "mozzarella-avocado-salad", emoji: "🥑", name: "Mozzarella-Avocado-Salat", type: "LUNCH", description: "Cremiger Salat mit Mozzarella, Avocado, Gurke und Kräutern.", prepMinutes: 8, ingredients: [["mozzarella", 130], ["avocado", 120], ["cucumber", 150], ["herbs", 10], ["oliveOil", 8]], style: "cold", vegetarian: true }),
  recipe({ key: "goat-cheese-zucchini-lunch", emoji: "🥒", name: "Zucchini mit Ziegenkäse", type: "LUNCH", description: "Gebratene Zucchini mit Ziegenkäse, Walnüssen und Kräutern.", prepMinutes: 20, ingredients: [["zucchini", 280], ["goatCheese", 90], ["walnuts", 20], ["oliveOil", 8]], style: "pan", vegetarian: true }),
  recipe({ key: "egg-avocado-lunch-salad", emoji: "🥚", name: "Ei-Avocado-Mittagssalat", type: "LUNCH", description: "Sättigender Salat mit Ei, Avocado, Radieschen und Gurke.", prepMinutes: 12, ingredients: [["egg", 150], ["avocado", 120], ["radish", 100], ["cucumber", 120], ["oliveOil", 8]], style: "cold", vegetarian: true }),
  recipe({ key: "ricotta-vegetable-bowl", emoji: "🥣", name: "Ricotta-Gemüse-Bowl", type: "LUNCH", description: "Milde Ricotta-Bowl mit Zucchini, Paprika und Kürbiskernen.", prepMinutes: 18, ingredients: [["ricotta", 170], ["zucchini", 180], ["pepper", 100], ["pumpkinSeeds", 20]], style: "pan", vegetarian: true }),
  recipe({ key: "chicken-tahini-salad", emoji: "🥗", name: "Hähnchen-Tahin-Salat", type: "LUNCH", description: "Hähnchensalat mit Gurke, Blattsalat und cremigem Tahin-Dressing.", prepMinutes: 22, ingredients: [["chicken", 180], ["cucumber", 140], ["lettuce", 120], ["tahini", 25], ["lemon", 12]], style: "pan" }),
  recipe({ key: "lamb-eggplant-lunch", emoji: "🍆", name: "Lamm-Auberginen-Teller", type: "LUNCH", description: "Gebratenes Lamm mit Aubergine und frischem Kräuteröl.", prepMinutes: 30, ingredients: [["lamb", 180], ["eggplant", 260], ["herbs", 12], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "cod-green-beans", emoji: "🐟", name: "Kabeljau mit grünen Bohnen", type: "LUNCH", description: "Milder Kabeljau mit grünen Bohnen, Knoblauch und Zitronenöl.", prepMinutes: 25, ingredients: [["cod", 210], ["greenBeans", 220], ["garlic", 5], ["oliveOil", 14], ["lemon", 10]], style: "pan" }),
  recipe({ key: "shrimp-cauliflower-rice", emoji: "🍤", name: "Garnelen auf Blumenkohlreis", type: "LUNCH", description: "Garnelen mit fein gehacktem Blumenkohl, Paprika und Kräutern.", prepMinutes: 22, ingredients: [["shrimp", 190], ["cauliflower", 280], ["pepper", 90], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "salmon-cucumber-bowl", emoji: "🥒", name: "Lachs-Gurken-Bowl", type: "LUNCH", description: "Lachs mit Gurke, Avocado, Blattsalat und Zitronendressing.", prepMinutes: 22, ingredients: [["salmon", 170], ["cucumber", 160], ["avocado", 100], ["lettuce", 80], ["lemon", 12]], style: "pan" }),
  recipe({ key: "turkey-artichoke-salad", emoji: "🌿", name: "Puten-Artischocken-Salat", type: "LUNCH", description: "Putenstreifen mit Artischocken, Gurke, Oliven und Blattsalat.", prepMinutes: 22, ingredients: [["turkey", 180], ["artichoke", 120], ["cucumber", 120], ["olives", 30], ["lettuce", 80]], style: "pan" }),
];

const dinnerRecipes: CuratedRecipe[] = [
  recipe({ key: "rosemary-chicken-broccoli", emoji: "🌿", name: "Rosmarinhähnchen mit Brokkoli", type: "DINNER", description: "Ofenhähnchen mit Brokkoli, Knoblauch und Rosmarinöl.", prepMinutes: 35, ingredients: [["chicken", 200], ["broccoli", 280], ["garlic", 6], ["oliveOil", 15]], style: "oven" }),
  recipe({ key: "turkey-meatballs-zucchini", emoji: "🍗", name: "Putenbällchen mit Zucchini", type: "DINNER", description: "Saftige Putenbällchen mit gebratener Zucchini und Kräutern.", prepMinutes: 32, ingredients: [["turkey", 200], ["egg", 50], ["zucchini", 260], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "beef-cabbage-pan", emoji: "🥬", name: "Rindfleisch-Kohl-Pfanne", type: "DINNER", description: "Herzhafte Pfanne mit Rindfleisch, Weißkohl und Paprika.", prepMinutes: 30, ingredients: [["beef", 190], ["cabbage", 240], ["pepper", 100], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "lamb-zucchini-grill", emoji: "🥩", name: "Lamm mit Kräuter-Zucchini", type: "DINNER", description: "Gebratenes Lamm mit Zucchini, Knoblauch und Kräutern.", prepMinutes: 30, ingredients: [["lamb", 190], ["zucchini", 280], ["garlic", 5], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "salmon-spinach-bake", emoji: "🐟", name: "Lachs-Spinat-Auflauf", type: "DINNER", description: "Saftiger Ofenlachs auf Spinat mit einer Ricottahaube.", prepMinutes: 32, ingredients: [["salmon", 190], ["spinach", 250], ["ricotta", 70], ["oliveOil", 8]], style: "oven" }),
  recipe({ key: "cod-cauliflower-gratin", emoji: "🥦", name: "Kabeljau-Blumenkohl-Gratin", type: "DINNER", description: "Milder Kabeljau mit Blumenkohl und goldener Mozzarellahaube.", prepMinutes: 38, ingredients: [["cod", 220], ["cauliflower", 280], ["mozzarella", 70], ["oliveOil", 8]], style: "oven" }),
  recipe({ key: "shrimp-eggplant-pan", emoji: "🍤", name: "Garnelen-Auberginen-Pfanne", type: "DINNER", description: "Garnelen mit Aubergine, Paprika, Knoblauch und Kräutern.", prepMinutes: 25, ingredients: [["shrimp", 200], ["eggplant", 240], ["pepper", 100], ["garlic", 6], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "chicken-stuffed-zucchini", emoji: "🥒", name: "Zucchini mit Hähnchenfüllung", type: "DINNER", description: "Gefüllte Zucchini mit Hähnchen, Feta und mediterranen Kräutern.", prepMinutes: 40, ingredients: [["chicken", 180], ["zucchini", 300], ["feta", 55], ["oliveOil", 8]], style: "oven" }),
  recipe({ key: "turkey-broccoli-casserole", emoji: "🥦", name: "Puten-Brokkoli-Auflauf", type: "DINNER", description: "Putenbrust mit Brokkoli und cremiger Ziegenkäsehaube.", prepMinutes: 38, ingredients: [["turkey", 200], ["broccoli", 280], ["goatCheese", 65], ["oliveOil", 8]], style: "oven" }),
  recipe({ key: "beef-pepper-pan", emoji: "🫑", name: "Rind-Paprika-Pfanne", type: "DINNER", description: "Rindfleischstreifen mit Paprika, Zucchini und Kräutern.", prepMinutes: 28, ingredients: [["beef", 190], ["pepper", 180], ["zucchini", 160], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "lamb-cauliflower-mash", emoji: "🥩", name: "Lamm mit Blumenkohlstampf", type: "DINNER", description: "Gebratenes Lamm mit cremigem Blumenkohl und Kräuteröl.", prepMinutes: 35, ingredients: [["lamb", 190], ["cauliflower", 320], ["butter", 15], ["herbs", 10]], style: "pan" }),
  recipe({ key: "salmon-green-beans", emoji: "🐟", name: "Lachs mit grünen Bohnen", type: "DINNER", description: "Ofenlachs mit grünen Bohnen, Knoblauch und Zitronenöl.", prepMinutes: 30, ingredients: [["salmon", 190], ["greenBeans", 240], ["garlic", 5], ["oliveOil", 12]], style: "oven" }),
  recipe({ key: "cod-asparagus-dinner", emoji: "🌱", name: "Kabeljau auf Spargel", type: "DINNER", description: "Kräuterkabeljau auf grünem Spargel mit Zitronenöl.", prepMinutes: 30, ingredients: [["cod", 220], ["asparagus", 280], ["oliveOil", 15], ["lemon", 12]], style: "oven" }),
  recipe({ key: "shrimp-garlic-spinach", emoji: "🍤", name: "Knoblauchgarnelen mit Spinat", type: "DINNER", description: "Garnelen mit Blattspinat, Knoblauch und Olivenöl aus der Pfanne.", prepMinutes: 20, ingredients: [["shrimp", 200], ["spinach", 260], ["garlic", 7], ["oliveOil", 15]], style: "pan" }),
  recipe({ key: "halloumi-eggplant-bake", emoji: "🍆", name: "Halloumi-Auberginen-Auflauf", type: "DINNER", description: "Vegetarischer Auflauf mit Aubergine, Halloumi und Paprika.", prepMinutes: 38, ingredients: [["halloumi", 130], ["eggplant", 250], ["pepper", 120], ["oliveOil", 10]], style: "oven", vegetarian: true }),
  recipe({ key: "feta-broccoli-bake", emoji: "🧀", name: "Brokkoli-Feta-Auflauf", type: "DINNER", description: "Brokkoli mit Feta, Ei und Kräutern aus dem Ofen.", prepMinutes: 35, ingredients: [["broccoli", 300], ["feta", 120], ["egg", 100], ["oliveOil", 6]], style: "oven", vegetarian: true }),
  recipe({ key: "mozzarella-zucchini-bake", emoji: "🥒", name: "Mozzarella-Zucchini-Auflauf", type: "DINNER", description: "Zucchinischeiben mit Mozzarella, Kräutern und wenigen Tomaten.", prepMinutes: 35, ingredients: [["zucchini", 320], ["mozzarella", 130], ["tomato", 80], ["oliveOil", 10]], style: "oven", vegetarian: true }),
  recipe({ key: "goat-cheese-mushrooms", emoji: "🍄", name: "Champignons mit Ziegenkäse", type: "DINNER", description: "Gefüllte Champignons mit Ziegenkäse, Spinat und Walnüssen.", prepMinutes: 32, ingredients: [["mushrooms", 280], ["goatCheese", 100], ["spinach", 100], ["walnuts", 18]], style: "oven", vegetarian: true }),
  recipe({ key: "vegetable-frittata-dinner", emoji: "🍳", name: "Mediterrane Gemüsefrittata", type: "DINNER", description: "Ofenfrittata mit Zucchini, Paprika, Spinat und Feta.", prepMinutes: 30, ingredients: [["egg", 180], ["zucchini", 120], ["pepper", 80], ["spinach", 80], ["feta", 50]], style: "oven", vegetarian: true }),
  recipe({ key: "cauliflower-feta-casserole", emoji: "🥦", name: "Blumenkohl-Feta-Auflauf", type: "DINNER", description: "Cremiger Blumenkohlauflauf mit Feta, Ei und Kürbiskernen.", prepMinutes: 38, ingredients: [["cauliflower", 320], ["feta", 110], ["egg", 80], ["pumpkinSeeds", 18]], style: "oven", vegetarian: true }),
  recipe({ key: "chicken-mushroom-dinner", emoji: "🍄", name: "Hähnchen-Champignon-Pfanne", type: "DINNER", description: "Hähnchenbrust mit Champignons, Spinat und Kräutern.", prepMinutes: 26, ingredients: [["chicken", 200], ["mushrooms", 180], ["spinach", 140], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "turkey-cauliflower-pan", emoji: "🍗", name: "Puten-Blumenkohl-Pfanne", type: "DINNER", description: "Putenstreifen mit Blumenkohl, Paprika und Knoblauch.", prepMinutes: 28, ingredients: [["turkey", 200], ["cauliflower", 280], ["pepper", 90], ["garlic", 5], ["oliveOil", 10]], style: "pan" }),
  recipe({ key: "beef-zucchini-boats", emoji: "🥒", name: "Zucchiniboote mit Rind", type: "DINNER", description: "Ofenzucchini mit würziger Rindfleisch- und Mozzarellafüllung.", prepMinutes: 42, ingredients: [["beef", 180], ["zucchini", 320], ["mozzarella", 60], ["herbs", 10]], style: "oven" }),
  recipe({ key: "herb-fish-vegetables", emoji: "🐟", name: "Kräuterfisch auf Ofengemüse", type: "DINNER", description: "Kabeljau auf Zucchini, Paprika und Aubergine mit Kräuteröl.", prepMinutes: 38, ingredients: [["cod", 220], ["zucchini", 140], ["pepper", 100], ["eggplant", 140], ["oliveOil", 15]], style: "oven" }),
];

const snackRecipes: CuratedRecipe[] = [
  recipe({ key: "cottage-cucumber-dip", emoji: "🥒", name: "Gurke mit Kräuter-Hüttenkäse", type: "SNACK", description: "Knackige Gurke mit einem schnellen Kräuter-Hüttenkäse-Dip.", prepMinutes: 5, ingredients: [["cucumber", 160], ["cottageCheese", 100], ["herbs", 8]], style: "cold", vegetarian: true }),
  recipe({ key: "avocado-radish-snack", emoji: "🥑", name: "Avocado mit Radieschen", type: "SNACK", description: "Cremige Avocado mit knackigen Radieschen und Zitronensaft.", prepMinutes: 5, ingredients: [["avocado", 100], ["radish", 100], ["lemon", 8]], style: "cold", vegetarian: true }),
  recipe({ key: "feta-olive-cup", emoji: "🫒", name: "Feta-Oliven-Schale", type: "SNACK", description: "Kleine mediterrane Schale mit Feta, Oliven und Gurke.", prepMinutes: 4, ingredients: [["feta", 60], ["olives", 35], ["cucumber", 80]], style: "bowl", vegetarian: true }),
  recipe({ key: "mozzarella-cucumber-bites", emoji: "🧀", name: "Mozzarella-Gurken-Happen", type: "SNACK", description: "Frische Gurkenhappen mit Mozzarella und Kräutern.", prepMinutes: 6, ingredients: [["mozzarella", 70], ["cucumber", 140], ["herbs", 6]], style: "cold", vegetarian: true }),
  recipe({ key: "goat-cheese-celery", emoji: "🌿", name: "Sellerie mit Ziegenkäse", type: "SNACK", description: "Knackige Selleriestangen mit cremigem Ziegenkäse.", prepMinutes: 5, ingredients: [["celery", 130], ["goatCheese", 55], ["herbs", 5]], style: "cold", vegetarian: true }),
  recipe({ key: "ricotta-cacao-snack", emoji: "🍫", name: "Ricotta-Kakao-Creme", type: "SNACK", description: "Ungesüßte Ricottacreme mit Kakao und gehackten Mandeln.", prepMinutes: 4, ingredients: [["ricotta", 100], ["cacao", 5], ["almonds", 15]], style: "bowl", vegetarian: true }),
  recipe({ key: "mini-chia-pudding", emoji: "🥥", name: "Kleiner Chia-Pudding", type: "SNACK", description: "Kleine Chia-Kokos-Portion mit wenigen frischen Beeren.", prepMinutes: 5, ingredients: [["chia", 20], ["coconutMilk", 100], ["berries", 30]], style: "bowl", vegetarian: true }),
  recipe({ key: "yogurt-berry-snack", emoji: "🫐", name: "Joghurt-Beeren-Snack", type: "SNACK", description: "Griechischer Joghurt mit Beeren und Kürbiskernen.", prepMinutes: 3, ingredients: [["yogurt", 120], ["berries", 45], ["pumpkinSeeds", 15]], style: "bowl", vegetarian: true }),
  recipe({ key: "egg-cucumber-snack", emoji: "🥚", name: "Ei-Gurken-Snack", type: "SNACK", description: "Gekochtes Ei mit Gurke, Kräutern und einem Spritzer Zitrone.", prepMinutes: 10, ingredients: [["egg", 60], ["cucumber", 130], ["herbs", 5], ["lemon", 5]], style: "cold", vegetarian: true }),
  recipe({ key: "turkey-cucumber-rolls", emoji: "🍗", name: "Puten-Gurken-Röllchen", type: "SNACK", description: "Kleine Putenröllchen mit Gurke und Kräuter-Hüttenkäse.", prepMinutes: 8, ingredients: [["turkey", 80], ["cucumber", 100], ["cottageCheese", 50]], style: "cold" }),
  recipe({ key: "tuna-cucumber-bites", emoji: "🐟", name: "Thunfisch-Gurken-Happen", type: "SNACK", description: "Gurkenscheiben mit Thunfisch, Avocado und Zitronensaft.", prepMinutes: 7, ingredients: [["tuna", 80], ["cucumber", 140], ["avocado", 50], ["lemon", 6]], style: "cold" }),
  recipe({ key: "sardine-lettuce-bites", emoji: "🥬", name: "Sardinen-Salat-Happen", type: "SNACK", description: "Kleine Salatblätter mit Sardinen, Gurke und Zitronenöl.", prepMinutes: 6, ingredients: [["sardines", 70], ["lettuce", 70], ["cucumber", 70], ["lemon", 6]], style: "cold" }),
  recipe({ key: "salmon-avocado-bites", emoji: "🥑", name: "Lachs-Avocado-Happen", type: "SNACK", description: "Kleine Avocadohappen mit gebratenem Lachs und Gurke.", prepMinutes: 12, ingredients: [["salmon", 70], ["avocado", 70], ["cucumber", 80]], style: "pan" }),
  recipe({ key: "pumpkin-seeds-olives", emoji: "🫒", name: "Oliven mit Kürbiskernen", type: "SNACK", description: "Salziger Snack aus Oliven und gerösteten Kürbiskernen.", prepMinutes: 3, ingredients: [["olives", 45], ["pumpkinSeeds", 25]], style: "bowl", vegetarian: true }),
  recipe({ key: "walnut-coconut-snack", emoji: "🥥", name: "Walnuss-Kokos-Mix", type: "SNACK", description: "Kleine Mischung aus Walnüssen und ungesüßten Kokosraspeln.", prepMinutes: 2, ingredients: [["walnuts", 25], ["coconut", 15]], style: "bowl", vegetarian: true }),
  recipe({ key: "almond-cacao-snack", emoji: "🍫", name: "Kakao-Mandeln", type: "SNACK", description: "Mandeln mit einer feinen Schicht aus ungesüßtem Kakao.", prepMinutes: 3, ingredients: [["almonds", 30], ["cacao", 4]], style: "bowl", vegetarian: true }),
  recipe({ key: "halloumi-snack-cubes", emoji: "🧀", name: "Warme Halloumiwürfel", type: "SNACK", description: "Goldbraune Halloumiwürfel mit Gurke und frischen Kräutern.", prepMinutes: 10, ingredients: [["halloumi", 70], ["cucumber", 100], ["herbs", 5]], style: "pan", vegetarian: true }),
  recipe({ key: "zucchini-feta-rolls", emoji: "🥒", name: "Zucchini-Feta-Röllchen", type: "SNACK", description: "Dünne Zucchinistreifen mit Feta und Kräuterfüllung.", prepMinutes: 12, ingredients: [["zucchini", 150], ["feta", 60], ["herbs", 6], ["oliveOil", 5]], style: "pan", vegetarian: true }),
  recipe({ key: "egg-salad-lettuce-snack", emoji: "🥬", name: "Eiersalat-Salatblätter", type: "SNACK", description: "Kleine Salatblätter mit Ei, Avocado und Kräutern.", prepMinutes: 10, ingredients: [["egg", 80], ["avocado", 50], ["lettuce", 60], ["herbs", 5]], style: "cold", vegetarian: true }),
  recipe({ key: "avocado-tahini-dip", emoji: "🥑", name: "Avocado-Tahin-Dip", type: "SNACK", description: "Cremiger Avocado-Tahin-Dip mit Gurken- und Selleriestangen.", prepMinutes: 6, ingredients: [["avocado", 90], ["tahini", 18], ["cucumber", 100], ["celery", 80]], style: "cold", vegetarian: true }),
  recipe({ key: "broccoli-cottage-dip", emoji: "🥦", name: "Brokkoli mit Hüttenkäse-Dip", type: "SNACK", description: "Gedämpfter Brokkoli mit würzigem Kräuter-Hüttenkäse.", prepMinutes: 10, ingredients: [["broccoli", 150], ["cottageCheese", 90], ["herbs", 6]], style: "pan", vegetarian: true }),
  recipe({ key: "pepper-feta-snack", emoji: "🫑", name: "Paprika mit Feta-Creme", type: "SNACK", description: "Knackige Paprikastreifen mit cremiger Feta-Kräuter-Füllung.", prepMinutes: 7, ingredients: [["pepper", 150], ["feta", 60], ["yogurt", 35], ["herbs", 5]], style: "cold", vegetarian: true }),
  recipe({ key: "radish-butter-snack", emoji: "🌱", name: "Radieschen mit Kräuterbutter", type: "SNACK", description: "Knackige Radieschen mit einer kleinen Portion Kräuterbutter.", prepMinutes: 5, ingredients: [["radish", 150], ["butter", 20], ["herbs", 5]], style: "cold", vegetarian: true }),
  recipe({ key: "celery-almond-cream", emoji: "🌿", name: "Sellerie mit Mandelcreme", type: "SNACK", description: "Selleriestangen mit Mandelmus und wenigen Kürbiskernen.", prepMinutes: 5, ingredients: [["celery", 140], ["almondButter", 25], ["pumpkinSeeds", 10]], style: "cold", vegetarian: true }),
  recipe({ key: "cucumber-ricotta-snack", emoji: "🥒", name: "Gurke mit Ricottacreme", type: "SNACK", description: "Gurkenscheiben mit Ricotta, Zitronensaft und Kräutern.", prepMinutes: 6, ingredients: [["cucumber", 160], ["ricotta", 80], ["lemon", 6], ["herbs", 5]], style: "cold", vegetarian: true }),
  recipe({ key: "mini-caprese-snack", emoji: "🍅", name: "Mini-Caprese", type: "SNACK", description: "Kleine Portion aus Mozzarella, Tomaten, Kräutern und Olivenöl.", prepMinutes: 5, ingredients: [["mozzarella", 70], ["tomato", 80], ["herbs", 5], ["oliveOil", 5]], style: "cold", vegetarian: true }),
];

const additionalBreakfastRecipes: CuratedRecipe[] = [
  recipe({ key: "skyr-walnut-berry-bowl", emoji: "🫐", name: "Skyr-Walnuss-Beeren-Bowl", type: "BREAKFAST", description: "Natur-Skyr mit Walnüssen, Beeren und einem Hauch Leinsamen.", prepMinutes: 4, ingredients: [["skyr", 200], ["walnuts", 25], ["berries", 50], ["flaxseed", 10]], style: "bowl", vegetarian: true }),
  recipe({ key: "skyr-almond-flax-bowl", emoji: "🌰", name: "Skyr mit Mandeln und Leinsamen", type: "BREAKFAST", description: "Proteinreicher Skyr mit Mandeln und geschroteten Leinsamen.", prepMinutes: 3, ingredients: [["skyr", 220], ["almonds", 25], ["flaxseed", 15]], style: "bowl", vegetarian: true }),
  recipe({ key: "cottage-pepper-breakfast-bowl", emoji: "🫑", name: "Hüttenkäse-Paprika-Bowl", type: "BREAKFAST", description: "Herzhafte Frühstücksbowl mit Hüttenkäse, Paprika und Kräutern.", prepMinutes: 6, ingredients: [["cottageCheese", 200], ["pepper", 140], ["herbs", 10], ["oliveOil", 5]], style: "bowl", vegetarian: true }),
  recipe({ key: "feta-spinach-baked-eggs", emoji: "🍳", name: "Ofeneier mit Feta und Spinat", type: "BREAKFAST", description: "Im Ofen gegarte Eier auf Blattspinat mit würzigem Feta.", prepMinutes: 22, ingredients: [["egg", 150], ["spinach", 160], ["feta", 50]], style: "oven", vegetarian: true }),
  recipe({ key: "ricotta-zucchini-omelette", emoji: "🥒", name: "Ricotta-Zucchini-Omelett", type: "BREAKFAST", description: "Saftiges Omelett mit Zucchini, Ricotta und frischen Kräutern.", prepMinutes: 16, ingredients: [["egg", 150], ["zucchini", 160], ["ricotta", 60], ["oliveOil", 6]], style: "pan", vegetarian: true }),
  recipe({ key: "goat-cheese-asparagus-scramble", emoji: "🌱", name: "Spargel-Rührei mit Ziegenkäse", type: "BREAKFAST", description: "Cremiges Rührei mit grünem Spargel und mildem Ziegenkäse.", prepMinutes: 17, ingredients: [["egg", 150], ["asparagus", 180], ["goatCheese", 40], ["oliveOil", 5]], style: "pan", vegetarian: true }),
  recipe({ key: "avocado-sardine-eggs", emoji: "🐟", name: "Avocado-Eier mit Sardinen", type: "BREAKFAST", description: "Sättigender Frühstücksteller mit Ei, Avocado und Sardinen.", prepMinutes: 12, ingredients: [["egg", 100], ["avocado", 100], ["sardines", 80], ["cucumber", 100]], style: "cold" }),
  recipe({ key: "salmon-spinach-omelette", emoji: "🍣", name: "Lachs-Spinat-Omelett", type: "BREAKFAST", description: "Proteinreiches Omelett mit Lachsfilet, Spinat und Zitronenkräutern.", prepMinutes: 20, ingredients: [["egg", 150], ["salmon", 90], ["spinach", 120], ["lemon", 8]], style: "pan" }),
  recipe({ key: "turkey-mushroom-scramble", emoji: "🍄", name: "Puten-Pilz-Rührei", type: "BREAKFAST", description: "Herzhaftes Rührei mit Putenbrust, Champignons und Kräutern.", prepMinutes: 17, ingredients: [["egg", 130], ["turkey", 100], ["mushrooms", 130], ["oliveOil", 6]], style: "pan" }),
  recipe({ key: "halloumi-pepper-eggs", emoji: "🧀", name: "Halloumi-Paprika-Eier", type: "BREAKFAST", description: "Gebratener Halloumi mit Paprika und weich gestockten Eiern.", prepMinutes: 16, ingredients: [["halloumi", 80], ["pepper", 130], ["egg", 120], ["oliveOil", 5]], style: "pan", vegetarian: true }),
  recipe({ key: "chia-almond-breakfast-pudding", emoji: "🥄", name: "Chia-Mandel-Frühstückspudding", type: "BREAKFAST", description: "Sämiger Chia-Pudding mit Mandelmus und wenigen frischen Beeren.", prepMinutes: 6, ingredients: [["chia", 30], ["coconutMilk", 140], ["almondButter", 22], ["berries", 35]], style: "bowl", vegetarian: true }),
  recipe({ key: "coconut-flax-breakfast-cream", emoji: "🥥", name: "Kokos-Leinsamen-Creme", type: "BREAKFAST", description: "Getreidefreie Frühstückscreme aus Kokosmilch, Leinsamen und Mandeln.", prepMinutes: 7, ingredients: [["coconutMilk", 150], ["flaxseed", 25], ["coconut", 15], ["almonds", 18]], style: "bowl", vegetarian: true }),
  recipe({ key: "mascarpone-cacao-walnut-bowl", emoji: "🍫", name: "Mascarpone-Kakao-Walnuss-Bowl", type: "BREAKFAST", description: "Ungesüßte Mascarponecreme mit Kakao und knackigen Walnüssen.", prepMinutes: 4, ingredients: [["mascarpone", 90], ["cacao", 6], ["walnuts", 24]], style: "bowl", vegetarian: true }),
  recipe({ key: "cottage-radish-breakfast", emoji: "🌱", name: "Hüttenkäse-Radieschen-Frühstück", type: "BREAKFAST", description: "Frischer Hüttenkäse mit Radieschen, Gurke und Kräutern.", prepMinutes: 5, ingredients: [["cottageCheese", 200], ["radish", 120], ["cucumber", 100], ["herbs", 8]], style: "cold", vegetarian: true }),
  recipe({ key: "mozzarella-avocado-breakfast-plate", emoji: "🥑", name: "Mozzarella-Avocado-Frühstücksteller", type: "BREAKFAST", description: "Milder Mozzarella mit Avocado, Gurke und frischem Kräuteröl.", prepMinutes: 7, ingredients: [["mozzarella", 100], ["avocado", 110], ["cucumber", 120], ["oliveOil", 6]], style: "cold", vegetarian: true }),
  recipe({ key: "feta-cucumber-egg-bowl", emoji: "🥚", name: "Feta-Gurken-Ei-Bowl", type: "BREAKFAST", description: "Kompakte Frühstücksbowl mit Ei, Feta, Gurke und Oliven.", prepMinutes: 11, ingredients: [["egg", 120], ["feta", 55], ["cucumber", 140], ["olives", 25]], style: "bowl", vegetarian: true }),
  recipe({ key: "tuna-avocado-egg-cups", emoji: "🥑", name: "Thunfisch-Avocado-Eierbecher", type: "BREAKFAST", description: "Kleine Ofenbecher aus Ei, Thunfisch und cremiger Avocado.", prepMinutes: 24, ingredients: [["egg", 140], ["tuna", 90], ["avocado", 70], ["herbs", 6]], style: "oven" }),
  recipe({ key: "broccoli-goat-cheese-frittata", emoji: "🥦", name: "Brokkoli-Ziegenkäse-Frittata", type: "BREAKFAST", description: "Mediterrane Frittata mit Brokkoli, Ziegenkäse und Kräutern.", prepMinutes: 25, ingredients: [["egg", 160], ["broccoli", 140], ["goatCheese", 45]], style: "oven", vegetarian: true }),
  recipe({ key: "zucchini-halloumi-scramble", emoji: "🥒", name: "Zucchini-Halloumi-Rührei", type: "BREAKFAST", description: "Herzhaftes Rührei mit Zucchini und goldbraunem Halloumi.", prepMinutes: 15, ingredients: [["egg", 140], ["zucchini", 160], ["halloumi", 65], ["oliveOil", 5]], style: "pan", vegetarian: true }),
  recipe({ key: "mushroom-ricotta-eggs", emoji: "🍄", name: "Pilz-Ricotta-Eierpfanne", type: "BREAKFAST", description: "Cremige Eierpfanne mit Champignons, Ricotta und frischen Kräutern.", prepMinutes: 15, ingredients: [["egg", 150], ["mushrooms", 150], ["ricotta", 55], ["oliveOil", 5]], style: "pan", vegetarian: true }),
  recipe({ key: "pumpkin-chia-skyr", emoji: "🫐", name: "Kürbiskern-Chia-Skyr", type: "BREAKFAST", description: "Natur-Skyr mit Kürbiskernen, Chiasamen und wenigen Beeren.", prepMinutes: 3, ingredients: [["skyr", 210], ["pumpkinSeeds", 22], ["chia", 15], ["berries", 35]], style: "bowl", vegetarian: true }),
  recipe({ key: "tahini-yogurt-breakfast-bowl", emoji: "🥄", name: "Tahin-Joghurt-Frühstücksbowl", type: "BREAKFAST", description: "Griechischer Joghurt mit Tahin, Walnüssen und Leinsamen.", prepMinutes: 4, ingredients: [["yogurt", 180], ["tahini", 20], ["walnuts", 18], ["flaxseed", 10]], style: "bowl", vegetarian: true }),
  recipe({ key: "almond-butter-chia-skyr", emoji: "🌰", name: "Mandelmus-Chia-Skyr", type: "BREAKFAST", description: "Cremiger Skyr mit Mandelmus, Chiasamen und einer kleinen Beerenportion.", prepMinutes: 4, ingredients: [["skyr", 200], ["almondButter", 20], ["chia", 18], ["berries", 35]], style: "bowl", vegetarian: true }),
  recipe({ key: "ricotta-berry-flax-bowl", emoji: "🫐", name: "Ricotta-Beeren-Leinsamen-Bowl", type: "BREAKFAST", description: "Milde Ricottacreme mit Beeren, Leinsamen und gehackten Mandeln.", prepMinutes: 5, ingredients: [["ricotta", 160], ["berries", 50], ["flaxseed", 18], ["almonds", 15]], style: "bowl", vegetarian: true }),
  recipe({ key: "cottage-olive-breakfast-plate", emoji: "🫒", name: "Hüttenkäse-Oliven-Teller", type: "BREAKFAST", description: "Mediterraner Frühstücksteller mit Hüttenkäse, Oliven und Gurke.", prepMinutes: 5, ingredients: [["cottageCheese", 190], ["olives", 35], ["cucumber", 150], ["herbs", 8]], style: "cold", vegetarian: true }),
  recipe({ key: "salmon-cucumber-breakfast-eggs", emoji: "🍣", name: "Lachs-Gurken-Frühstückseier", type: "BREAKFAST", description: "Gekochte Eier mit Lachs, Gurke und einem frischen Zitronenabschluss.", prepMinutes: 13, ingredients: [["egg", 120], ["salmon", 90], ["cucumber", 140], ["lemon", 8]], style: "cold" }),
  recipe({ key: "turkey-spinach-breakfast-eggs", emoji: "🍃", name: "Puten-Spinat-Frühstückspfanne", type: "BREAKFAST", description: "Warme Frühstückspfanne mit Putenbrust, Ei und Blattspinat.", prepMinutes: 17, ingredients: [["turkey", 110], ["egg", 130], ["spinach", 150], ["oliveOil", 6]], style: "pan" }),
  recipe({ key: "sardine-avocado-breakfast-plate", emoji: "🐟", name: "Sardinen-Avocado-Frühstücksteller", type: "BREAKFAST", description: "Mediterraner Teller mit Sardinen, Avocado, Radieschen und Gurke.", prepMinutes: 7, ingredients: [["sardines", 90], ["avocado", 100], ["radish", 90], ["cucumber", 100]], style: "cold" }),
  recipe({ key: "cauliflower-feta-breakfast-bake", emoji: "🥦", name: "Blumenkohl-Feta-Frühstücksauflauf", type: "BREAKFAST", description: "Kleiner Frühstücksauflauf mit Blumenkohl, Ei und würzigem Feta.", prepMinutes: 28, ingredients: [["cauliflower", 180], ["egg", 150], ["feta", 55]], style: "oven", vegetarian: true }),
  recipe({ key: "asparagus-mozzarella-frittata", emoji: "🌱", name: "Spargel-Mozzarella-Frittata", type: "BREAKFAST", description: "Lockere Frittata mit grünem Spargel, Mozzarella und Kräutern.", prepMinutes: 25, ingredients: [["asparagus", 180], ["egg", 160], ["mozzarella", 55]], style: "oven", vegetarian: true }),
];

const additionalLunchRecipes: CuratedRecipe[] = [
  recipe({ key: "chicken-artichoke-salad", emoji: "🌿", name: "Hähnchen-Artischocken-Salat", type: "LUNCH", description: "Mediterraner Salat mit Hähnchen, Artischocken, Gurke und Oliven.", prepMinutes: 22, ingredients: [["chicken", 180], ["artichoke", 130], ["cucumber", 120], ["olives", 30], ["oliveOil", 10]], style: "pan" }),
  recipe({ key: "turkey-broccoli-lunch-bowl", emoji: "🥦", name: "Puten-Brokkoli-Mittagsbowl", type: "LUNCH", description: "Sättigende Bowl mit Pute, Brokkoli, Paprika und Zitronenöl.", prepMinutes: 24, ingredients: [["turkey", 190], ["broccoli", 240], ["pepper", 90], ["oliveOil", 10], ["lemon", 8]], style: "bowl" }),
  recipe({ key: "beef-eggplant-lunch-skillet", emoji: "🍆", name: "Rind-Auberginen-Mittagspfanne", type: "LUNCH", description: "Würzige Rindfleischpfanne mit Aubergine, Paprika und Kräutern.", prepMinutes: 28, ingredients: [["beef", 180], ["eggplant", 240], ["pepper", 100], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "lamb-asparagus-lunch-plate", emoji: "🌱", name: "Lamm-Spargel-Mittagsteller", type: "LUNCH", description: "Gebratenes Lamm mit grünem Spargel und cremigem Kräuter-Tahin.", prepMinutes: 27, ingredients: [["lamb", 170], ["asparagus", 250], ["tahini", 20], ["lemon", 10]], style: "pan" }),
  recipe({ key: "salmon-zucchini-lunch-salad", emoji: "🍣", name: "Lachs-Zucchini-Mittagssalat", type: "LUNCH", description: "Lauwarmer Salat mit Lachs, Zucchini, Blattsalat und Gurke.", prepMinutes: 23, ingredients: [["salmon", 180], ["zucchini", 180], ["lettuce", 90], ["cucumber", 120], ["oliveOil", 10]], style: "pan" }),
  recipe({ key: "cod-broccoli-lunch-bowl", emoji: "🐟", name: "Kabeljau-Brokkoli-Bowl", type: "LUNCH", description: "Milde Fischbowl mit Kabeljau, Brokkoli und Zitronen-Kräuteröl.", prepMinutes: 24, ingredients: [["cod", 210], ["broccoli", 260], ["oliveOil", 14], ["lemon", 12], ["herbs", 8]], style: "bowl" }),
  recipe({ key: "shrimp-cauliflower-lunch-pan", emoji: "🍤", name: "Garnelen-Blumenkohl-Pfanne", type: "LUNCH", description: "Schnelle Garnelenpfanne mit fein gehacktem Blumenkohl und Paprika.", prepMinutes: 21, ingredients: [["shrimp", 180], ["cauliflower", 260], ["pepper", 100], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "tuna-artichoke-lettuce-bowl", emoji: "🥬", name: "Thunfisch-Artischocken-Salat", type: "LUNCH", description: "Frischer Blattsalat mit Thunfisch, Artischocken, Gurke und Oliven.", prepMinutes: 9, ingredients: [["tuna", 150], ["artichoke", 120], ["lettuce", 100], ["cucumber", 100], ["olives", 25]], style: "cold" }),
  recipe({ key: "sardine-avocado-lunch-bowl", emoji: "🥑", name: "Sardinen-Avocado-Mittagsbowl", type: "LUNCH", description: "Kräftige Bowl mit Sardinen, Avocado, Gurke und Radieschen.", prepMinutes: 8, ingredients: [["sardines", 130], ["avocado", 120], ["cucumber", 130], ["radish", 90], ["lemon", 8]], style: "bowl" }),
  recipe({ key: "halloumi-green-bean-salad", emoji: "🧀", name: "Halloumi-Bohnensalat", type: "LUNCH", description: "Lauwarmer Salat mit Halloumi, grünen Bohnen, Paprika und Kräutern.", prepMinutes: 20, ingredients: [["halloumi", 120], ["greenBeans", 220], ["pepper", 90], ["oliveOil", 8]], style: "pan", vegetarian: true }),
  recipe({ key: "feta-broccoli-lunch-frittata", emoji: "🥦", name: "Feta-Brokkoli-Mittagsfrittata", type: "LUNCH", description: "Ofenfrittata mit Brokkoli, Feta, Ei und frischen Kräutern.", prepMinutes: 30, ingredients: [["egg", 170], ["broccoli", 220], ["feta", 75]], style: "oven", vegetarian: true }),
  recipe({ key: "mozzarella-eggplant-lunch-bake", emoji: "🍆", name: "Mozzarella-Auberginen-Mittagsauflauf", type: "LUNCH", description: "Mediterraner Auberginenauflauf mit Mozzarella, Paprika und Kräutern.", prepMinutes: 36, ingredients: [["eggplant", 280], ["mozzarella", 120], ["pepper", 90], ["oliveOil", 10]], style: "oven", vegetarian: true }),
  recipe({ key: "goat-cheese-zucchini-lunch-salad", emoji: "🥒", name: "Ziegenkäse-Zucchini-Salat", type: "LUNCH", description: "Lauwarmer Zucchinisalat mit Ziegenkäse, Walnüssen und Blattsalat.", prepMinutes: 18, ingredients: [["zucchini", 220], ["goatCheese", 70], ["walnuts", 20], ["lettuce", 90]], style: "pan", vegetarian: true }),
  recipe({ key: "cottage-avocado-lunch-bowl", emoji: "🥑", name: "Hüttenkäse-Avocado-Mittagsbowl", type: "LUNCH", description: "Cremige Bowl mit Hüttenkäse, Avocado, Gurke und Kürbiskernen.", prepMinutes: 7, ingredients: [["cottageCheese", 220], ["avocado", 120], ["cucumber", 150], ["pumpkinSeeds", 18]], style: "bowl", vegetarian: true }),
  recipe({ key: "egg-tahini-lunch-salad", emoji: "🥚", name: "Ei-Tahin-Mittagssalat", type: "LUNCH", description: "Sättigender Salat mit Ei, Gurke, Blattsalat und Zitronen-Tahin.", prepMinutes: 12, ingredients: [["egg", 150], ["cucumber", 140], ["lettuce", 110], ["tahini", 22], ["lemon", 10]], style: "cold", vegetarian: true }),
  recipe({ key: "chicken-cabbage-lunch-pan", emoji: "🥬", name: "Hähnchen-Kohl-Mittagspfanne", type: "LUNCH", description: "Herzhafte Hähnchenpfanne mit Weißkohl, Paprika und Knoblauch.", prepMinutes: 27, ingredients: [["chicken", 190], ["cabbage", 250], ["pepper", 90], ["garlic", 5], ["oliveOil", 10]], style: "pan" }),
  recipe({ key: "turkey-asparagus-lunch-salad", emoji: "🌱", name: "Puten-Spargel-Mittagssalat", type: "LUNCH", description: "Lauwarmer Salat mit Putenstreifen, Spargel, Gurke und Blattsalat.", prepMinutes: 23, ingredients: [["turkey", 180], ["asparagus", 230], ["cucumber", 110], ["lettuce", 90], ["oliveOil", 10]], style: "pan" }),
  recipe({ key: "beef-mushroom-lunch-bowl", emoji: "🍄", name: "Rind-Pilz-Mittagsbowl", type: "LUNCH", description: "Würzige Bowl mit Rindfleisch, Champignons, Spinat und Kräutern.", prepMinutes: 25, ingredients: [["beef", 180], ["mushrooms", 200], ["spinach", 140], ["oliveOil", 10]], style: "bowl" }),
  recipe({ key: "lamb-pepper-lunch-salad", emoji: "🫑", name: "Lamm-Paprika-Mittagssalat", type: "LUNCH", description: "Mediterraner Salat mit Lamm, Paprika, Gurke und Oliven.", prepMinutes: 24, ingredients: [["lamb", 170], ["pepper", 140], ["cucumber", 130], ["olives", 30], ["lettuce", 90]], style: "pan" }),
  recipe({ key: "salmon-cauliflower-lunch-plate", emoji: "🥦", name: "Lachs-Blumenkohl-Mittagsteller", type: "LUNCH", description: "Gebratener Lachs auf Blumenkohl mit Zitronenöl und Kräutern.", prepMinutes: 25, ingredients: [["salmon", 180], ["cauliflower", 280], ["oliveOil", 12], ["lemon", 10]], style: "pan" }),
  recipe({ key: "cod-green-bean-lunch", emoji: "🌿", name: "Zitronen-Kabeljau mit grünen Bohnen", type: "LUNCH", description: "Milder Kabeljau mit grünen Bohnen, Knoblauch und Zitronenöl.", prepMinutes: 26, ingredients: [["cod", 210], ["greenBeans", 250], ["garlic", 4], ["oliveOil", 14], ["lemon", 10]], style: "pan" }),
  recipe({ key: "shrimp-zucchini-lunch-pan", emoji: "🍤", name: "Garnelen-Zucchini-Mittagspfanne", type: "LUNCH", description: "Leichte Garnelenpfanne mit Zucchini, Paprika und frischen Kräutern.", prepMinutes: 19, ingredients: [["shrimp", 190], ["zucchini", 240], ["pepper", 90], ["oliveOil", 10]], style: "pan" }),
  recipe({ key: "tuna-stuffed-pepper-lunch", emoji: "🫑", name: "Paprika mit Thunfischfüllung", type: "LUNCH", description: "Ofenpaprika mit Thunfisch, Feta und mediterranen Kräutern.", prepMinutes: 32, ingredients: [["pepper", 250], ["tuna", 150], ["feta", 55], ["herbs", 8]], style: "oven" }),
  recipe({ key: "sardine-cucumber-egg-salad", emoji: "🐟", name: "Sardinen-Gurken-Eiersalat", type: "LUNCH", description: "Kräftiger Mittagssalat mit Sardinen, Ei, Gurke und Blattsalat.", prepMinutes: 11, ingredients: [["sardines", 120], ["egg", 100], ["cucumber", 150], ["lettuce", 90], ["lemon", 8]], style: "cold" }),
  recipe({ key: "halloumi-cauliflower-lunch-bowl", emoji: "🧀", name: "Halloumi-Blumenkohl-Mittagsbowl", type: "LUNCH", description: "Warme Bowl mit Halloumi, Blumenkohl, Paprika und Tahin.", prepMinutes: 24, ingredients: [["halloumi", 120], ["cauliflower", 250], ["pepper", 90], ["tahini", 18]], style: "bowl", vegetarian: true }),
  recipe({ key: "ricotta-spinach-lunch-frittata", emoji: "🍃", name: "Ricotta-Spinat-Mittagsfrittata", type: "LUNCH", description: "Lockere Frittata mit Ricotta, Blattspinat und frischen Kräutern.", prepMinutes: 27, ingredients: [["egg", 170], ["ricotta", 80], ["spinach", 180]], style: "oven", vegetarian: true }),
  recipe({ key: "feta-artichoke-lunch-salad", emoji: "🌿", name: "Feta-Artischocken-Mittagssalat", type: "LUNCH", description: "Mediterraner Salat mit Feta, Artischocken, Gurke und Oliven.", prepMinutes: 8, ingredients: [["feta", 90], ["artichoke", 140], ["cucumber", 140], ["olives", 30], ["lettuce", 90]], style: "cold", vegetarian: true }),
  recipe({ key: "mozzarella-broccoli-lunch-plate", emoji: "🥦", name: "Mozzarella-Brokkoli-Mittagsteller", type: "LUNCH", description: "Gerösteter Brokkoli mit Mozzarella, Walnüssen und Kräuteröl.", prepMinutes: 22, ingredients: [["broccoli", 260], ["mozzarella", 110], ["walnuts", 20], ["oliveOil", 8]], style: "oven", vegetarian: true }),
  recipe({ key: "chicken-avocado-lettuce-cups", emoji: "🥬", name: "Hähnchen-Avocado-Salatbecher", type: "LUNCH", description: "Knackige Salatblätter mit Hähnchen, Avocado und Gurke.", prepMinutes: 19, ingredients: [["chicken", 170], ["avocado", 110], ["lettuce", 120], ["cucumber", 110], ["lemon", 8]], style: "pan" }),
  recipe({ key: "beef-cabbage-lunch-salad", emoji: "🥩", name: "Rind-Kohl-Mittagssalat", type: "LUNCH", description: "Lauwarmer Kohlsalat mit Rindfleisch, Paprika und Zitronenöl.", prepMinutes: 25, ingredients: [["beef", 180], ["cabbage", 230], ["pepper", 100], ["oliveOil", 10], ["lemon", 8]], style: "pan" }),
];

const additionalDinnerRecipes: CuratedRecipe[] = [
  recipe({ key: "chicken-artichoke-dinner-bake", emoji: "🌿", name: "Hähnchen-Artischocken-Abendauflauf", type: "DINNER", description: "Ofengericht mit Hähnchen, Artischocken, Zucchini und Mozzarella.", prepMinutes: 38, ingredients: [["chicken", 190], ["artichoke", 140], ["zucchini", 180], ["mozzarella", 60]], style: "oven" }),
  recipe({ key: "turkey-green-bean-dinner-pan", emoji: "🌿", name: "Puten-Bohnen-Abendpfanne", type: "DINNER", description: "Putenstreifen mit grünen Bohnen, Paprika und Knoblauch.", prepMinutes: 27, ingredients: [["turkey", 200], ["greenBeans", 250], ["pepper", 100], ["garlic", 5], ["oliveOil", 10]], style: "pan" }),
  recipe({ key: "beef-cauliflower-dinner-bake", emoji: "🥦", name: "Rind-Blumenkohl-Abendauflauf", type: "DINNER", description: "Herzhafter Auflauf mit Rindfleisch, Blumenkohl und Mozzarella.", prepMinutes: 42, ingredients: [["beef", 190], ["cauliflower", 300], ["mozzarella", 70], ["herbs", 8]], style: "oven" }),
  recipe({ key: "lamb-artichoke-dinner-pan", emoji: "🥩", name: "Lamm-Artischocken-Abendpfanne", type: "DINNER", description: "Mediterrane Lammpfanne mit Artischocken, Paprika und Oliven.", prepMinutes: 30, ingredients: [["lamb", 190], ["artichoke", 150], ["pepper", 100], ["olives", 30], ["oliveOil", 10]], style: "pan" }),
  recipe({ key: "salmon-broccoli-dinner-bake", emoji: "🍣", name: "Lachs-Brokkoli-Abendblech", type: "DINNER", description: "Ofenlachs mit Brokkoli, Zitronenöl und gerösteten Kürbiskernen.", prepMinutes: 32, ingredients: [["salmon", 200], ["broccoli", 290], ["oliveOil", 12], ["lemon", 10], ["pumpkinSeeds", 15]], style: "oven" }),
  recipe({ key: "cod-eggplant-dinner-bake", emoji: "🍆", name: "Kabeljau-Auberginen-Abendblech", type: "DINNER", description: "Kabeljau auf Aubergine und Paprika mit mediterranem Kräuteröl.", prepMinutes: 36, ingredients: [["cod", 230], ["eggplant", 250], ["pepper", 100], ["oliveOil", 15]], style: "oven" }),
  recipe({ key: "shrimp-asparagus-dinner-pan", emoji: "🍤", name: "Garnelen-Spargel-Abendpfanne", type: "DINNER", description: "Schnelle Abendpfanne mit Garnelen, grünem Spargel und Zucchini.", prepMinutes: 22, ingredients: [["shrimp", 200], ["asparagus", 220], ["zucchini", 160], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "tuna-zucchini-dinner-boats", emoji: "🥒", name: "Zucchiniboote mit Thunfisch", type: "DINNER", description: "Ofenzucchini mit Thunfisch, Feta und frischen Kräutern.", prepMinutes: 38, ingredients: [["zucchini", 340], ["tuna", 160], ["feta", 65], ["herbs", 8]], style: "oven" }),
  recipe({ key: "sardine-cauliflower-dinner", emoji: "🐟", name: "Sardinen auf Röstblumenkohl", type: "DINNER", description: "Kräftige Sardinen auf geröstetem Blumenkohl mit Zitronenöl.", prepMinutes: 28, ingredients: [["sardines", 150], ["cauliflower", 300], ["oliveOil", 12], ["lemon", 10]], style: "oven" }),
  recipe({ key: "halloumi-broccoli-dinner-bake", emoji: "🧀", name: "Halloumi-Brokkoli-Abendauflauf", type: "DINNER", description: "Vegetarischer Auflauf mit Halloumi, Brokkoli und Paprika.", prepMinutes: 35, ingredients: [["halloumi", 140], ["broccoli", 280], ["pepper", 100], ["oliveOil", 8]], style: "oven", vegetarian: true }),
  recipe({ key: "feta-spinach-dinner-frittata", emoji: "🍃", name: "Feta-Spinat-Abendfrittata", type: "DINNER", description: "Herzhafte Ofenfrittata mit Feta, Blattspinat und Zucchini.", prepMinutes: 30, ingredients: [["egg", 180], ["feta", 90], ["spinach", 180], ["zucchini", 120]], style: "oven", vegetarian: true }),
  recipe({ key: "mozzarella-cauliflower-dinner-bake", emoji: "🥦", name: "Mozzarella-Blumenkohl-Abendauflauf", type: "DINNER", description: "Cremiger Blumenkohlauflauf mit Mozzarella und frischen Kräutern.", prepMinutes: 36, ingredients: [["cauliflower", 320], ["mozzarella", 130], ["egg", 100], ["herbs", 8]], style: "oven", vegetarian: true }),
  recipe({ key: "goat-cheese-eggplant-dinner", emoji: "🍆", name: "Aubergine mit Ziegenkäse", type: "DINNER", description: "Ofenaubergine mit Ziegenkäse, Walnüssen und Kräutern.", prepMinutes: 34, ingredients: [["eggplant", 300], ["goatCheese", 90], ["walnuts", 20], ["oliveOil", 8]], style: "oven", vegetarian: true }),
  recipe({ key: "ricotta-broccoli-dinner-bake", emoji: "🥦", name: "Ricotta-Brokkoli-Abendauflauf", type: "DINNER", description: "Milder Brokkoliauflauf mit Ricotta, Ei und Zitronenkräutern.", prepMinutes: 35, ingredients: [["broccoli", 290], ["ricotta", 130], ["egg", 120], ["lemon", 8]], style: "oven", vegetarian: true }),
  recipe({ key: "chicken-mushroom-dinner-bake", emoji: "🍄", name: "Hähnchen-Pilz-Abendauflauf", type: "DINNER", description: "Ofengericht mit Hähnchen, Champignons, Spinat und Mozzarella.", prepMinutes: 38, ingredients: [["chicken", 200], ["mushrooms", 200], ["spinach", 140], ["mozzarella", 60]], style: "oven" }),
  recipe({ key: "turkey-eggplant-dinner-bake", emoji: "🍆", name: "Puten-Auberginen-Abendauflauf", type: "DINNER", description: "Mediterraner Auflauf mit Putenbrust, Aubergine, Paprika und Feta.", prepMinutes: 40, ingredients: [["turkey", 200], ["eggplant", 260], ["pepper", 100], ["feta", 55]], style: "oven" }),
  recipe({ key: "beef-asparagus-dinner-pan", emoji: "🌱", name: "Rind-Spargel-Abendpfanne", type: "DINNER", description: "Rindfleischstreifen mit grünem Spargel, Champignons und Kräutern.", prepMinutes: 28, ingredients: [["beef", 190], ["asparagus", 240], ["mushrooms", 150], ["oliveOil", 10]], style: "pan" }),
  recipe({ key: "lamb-broccoli-dinner-plate", emoji: "🥦", name: "Lamm-Brokkoli-Abendteller", type: "DINNER", description: "Gebratenes Lamm mit Brokkoli und cremiger Zitronen-Tahin-Sauce.", prepMinutes: 29, ingredients: [["lamb", 190], ["broccoli", 280], ["tahini", 22], ["lemon", 10]], style: "pan" }),
  recipe({ key: "salmon-artichoke-dinner-bake", emoji: "🌿", name: "Lachs-Artischocken-Abendblech", type: "DINNER", description: "Ofenlachs mit Artischocken, Zucchini und mediterranen Kräutern.", prepMinutes: 34, ingredients: [["salmon", 200], ["artichoke", 150], ["zucchini", 200], ["oliveOil", 12]], style: "oven" }),
  recipe({ key: "cod-cabbage-dinner-pan", emoji: "🥬", name: "Kabeljau-Kohl-Abendpfanne", type: "DINNER", description: "Milde Pfanne mit Kabeljau, Weißkohl, Paprika und Zitronenöl.", prepMinutes: 28, ingredients: [["cod", 230], ["cabbage", 260], ["pepper", 100], ["oliveOil", 13], ["lemon", 8]], style: "pan" }),
  recipe({ key: "shrimp-green-bean-dinner", emoji: "🍤", name: "Garnelen mit grünen Bohnen", type: "DINNER", description: "Gebratene Garnelen mit grünen Bohnen, Knoblauch und Kräutern.", prepMinutes: 23, ingredients: [["shrimp", 200], ["greenBeans", 250], ["garlic", 5], ["oliveOil", 12]], style: "pan" }),
  recipe({ key: "tuna-cauliflower-dinner-bake", emoji: "🥦", name: "Thunfisch-Blumenkohl-Abendauflauf", type: "DINNER", description: "Proteinreicher Auflauf mit Thunfisch, Blumenkohl, Ei und Feta.", prepMinutes: 37, ingredients: [["tuna", 170], ["cauliflower", 290], ["egg", 120], ["feta", 60]], style: "oven" }),
  recipe({ key: "sardine-zucchini-dinner-bake", emoji: "🥒", name: "Sardinen-Zucchini-Abendblech", type: "DINNER", description: "Ofenzucchini mit Sardinen, Paprika und frischem Zitronenöl.", prepMinutes: 30, ingredients: [["sardines", 150], ["zucchini", 280], ["pepper", 100], ["oliveOil", 10], ["lemon", 8]], style: "oven" }),
  recipe({ key: "halloumi-artichoke-dinner-pan", emoji: "🌿", name: "Halloumi-Artischocken-Abendpfanne", type: "DINNER", description: "Goldbrauner Halloumi mit Artischocken, Paprika und Oliven.", prepMinutes: 22, ingredients: [["halloumi", 140], ["artichoke", 150], ["pepper", 100], ["olives", 30]], style: "pan", vegetarian: true }),
  recipe({ key: "feta-green-bean-dinner-bake", emoji: "🌿", name: "Feta-Bohnen-Abendauflauf", type: "DINNER", description: "Vegetarischer Auflauf mit grünen Bohnen, Feta, Ei und Kräutern.", prepMinutes: 35, ingredients: [["greenBeans", 280], ["feta", 110], ["egg", 140], ["herbs", 8]], style: "oven", vegetarian: true }),
  recipe({ key: "mozzarella-mushroom-dinner-bake", emoji: "🍄", name: "Mozzarella-Pilz-Abendauflauf", type: "DINNER", description: "Champignons und Spinat unter einer goldenen Mozzarellaschicht.", prepMinutes: 32, ingredients: [["mushrooms", 260], ["spinach", 170], ["mozzarella", 130], ["egg", 100]], style: "oven", vegetarian: true }),
  recipe({ key: "goat-cheese-cauliflower-dinner", emoji: "🥦", name: "Blumenkohl mit Ziegenkäse", type: "DINNER", description: "Gerösteter Blumenkohl mit Ziegenkäse, Kürbiskernen und Kräutern.", prepMinutes: 33, ingredients: [["cauliflower", 320], ["goatCheese", 90], ["pumpkinSeeds", 20], ["oliveOil", 8]], style: "oven", vegetarian: true }),
  recipe({ key: "chicken-spinach-dinner-rolls", emoji: "🍃", name: "Hähnchen-Spinat-Abendrollen", type: "DINNER", description: "Hähnchenrollen mit Spinat- und Feta-Füllung aus dem Ofen.", prepMinutes: 42, ingredients: [["chicken", 220], ["spinach", 160], ["feta", 70], ["oliveOil", 6]], style: "oven" }),
  recipe({ key: "turkey-broccoli-dinner-bake", emoji: "🥦", name: "Puten-Brokkoli-Abendauflauf", type: "DINNER", description: "Cremiger Ofenauflauf mit Putenbrust, Brokkoli und Ricotta.", prepMinutes: 39, ingredients: [["turkey", 210], ["broccoli", 280], ["ricotta", 100], ["herbs", 8]], style: "oven" }),
  recipe({ key: "beef-artichoke-dinner-pan", emoji: "🌿", name: "Rind-Artischocken-Abendpfanne", type: "DINNER", description: "Rindfleischpfanne mit Artischocken, Zucchini und mediterranen Kräutern.", prepMinutes: 29, ingredients: [["beef", 190], ["artichoke", 150], ["zucchini", 210], ["oliveOil", 10]], style: "pan" }),
];

const additionalSnackRecipes: CuratedRecipe[] = [
  recipe({ key: "skyr-walnut-snack", emoji: "🫐", name: "Skyr-Walnuss-Snack", type: "SNACK", description: "Natur-Skyr mit Walnüssen und einer kleinen Portion Beeren.", prepMinutes: 3, ingredients: [["skyr", 140], ["walnuts", 18], ["berries", 30]], style: "bowl", vegetarian: true }),
  recipe({ key: "skyr-almond-butter-snack", emoji: "🌰", name: "Skyr mit Mandelmus", type: "SNACK", description: "Cremiger Skyr mit Mandelmus und wenigen geschroteten Leinsamen.", prepMinutes: 3, ingredients: [["skyr", 140], ["almondButter", 18], ["flaxseed", 8]], style: "bowl", vegetarian: true }),
  recipe({ key: "cottage-radish-snack", emoji: "🌱", name: "Hüttenkäse-Radieschen-Schale", type: "SNACK", description: "Herzhafte Snackschale mit Hüttenkäse, Radieschen und Kräutern.", prepMinutes: 4, ingredients: [["cottageCheese", 120], ["radish", 100], ["herbs", 6]], style: "bowl", vegetarian: true }),
  recipe({ key: "cottage-pepper-snack", emoji: "🫑", name: "Paprika-Hüttenkäse-Happen", type: "SNACK", description: "Knackige Paprikastücke mit Hüttenkäse und Kürbiskernen.", prepMinutes: 6, ingredients: [["pepper", 140], ["cottageCheese", 100], ["pumpkinSeeds", 12]], style: "cold", vegetarian: true }),
  recipe({ key: "feta-cucumber-olive-skewers", emoji: "🫒", name: "Feta-Gurken-Oliven-Spieße", type: "SNACK", description: "Kleine mediterrane Spieße mit Feta, Gurke und Oliven.", prepMinutes: 7, ingredients: [["feta", 60], ["cucumber", 120], ["olives", 30]], style: "cold", vegetarian: true }),
  recipe({ key: "mozzarella-radish-bites", emoji: "🧀", name: "Mozzarella-Radieschen-Happen", type: "SNACK", description: "Milde Mozzarellahappen mit Radieschen und frischen Kräutern.", prepMinutes: 5, ingredients: [["mozzarella", 70], ["radish", 110], ["herbs", 5]], style: "cold", vegetarian: true }),
  recipe({ key: "goat-cheese-cucumber-rolls", emoji: "🥒", name: "Gurkenrollen mit Ziegenkäse", type: "SNACK", description: "Dünne Gurkenrollen mit Ziegenkäse und gehackten Walnüssen.", prepMinutes: 8, ingredients: [["cucumber", 160], ["goatCheese", 55], ["walnuts", 12]], style: "cold", vegetarian: true }),
  recipe({ key: "ricotta-berry-snack-cup", emoji: "🫐", name: "Ricotta-Beeren-Snackbecher", type: "SNACK", description: "Kleine Ricottacreme mit frischen Beeren und Chiasamen.", prepMinutes: 4, ingredients: [["ricotta", 100], ["berries", 35], ["chia", 10]], style: "bowl", vegetarian: true }),
  recipe({ key: "mascarpone-walnut-snack", emoji: "🌰", name: "Mascarpone-Walnuss-Creme", type: "SNACK", description: "Kleine ungesüßte Mascarponecreme mit Walnüssen und Kakao.", prepMinutes: 3, ingredients: [["mascarpone", 65], ["walnuts", 16], ["cacao", 4]], style: "bowl", vegetarian: true }),
  recipe({ key: "chia-skyr-snack", emoji: "🥄", name: "Chia-Skyr-Becher", type: "SNACK", description: "Proteinreicher Skyrbecher mit Chiasamen und wenigen Beeren.", prepMinutes: 4, ingredients: [["skyr", 140], ["chia", 15], ["berries", 30]], style: "bowl", vegetarian: true }),
  recipe({ key: "flax-yogurt-snack", emoji: "🫐", name: "Leinsamen-Joghurt-Snack", type: "SNACK", description: "Griechischer Joghurt mit Leinsamen und gehackten Mandeln.", prepMinutes: 3, ingredients: [["yogurt", 120], ["flaxseed", 14], ["almonds", 14]], style: "bowl", vegetarian: true }),
  recipe({ key: "avocado-feta-snack-cup", emoji: "🥑", name: "Avocado-Feta-Snackschale", type: "SNACK", description: "Kleine Schale mit Avocado, Feta, Gurke und Zitronensaft.", prepMinutes: 5, ingredients: [["avocado", 75], ["feta", 50], ["cucumber", 90], ["lemon", 6]], style: "bowl", vegetarian: true }),
  recipe({ key: "avocado-egg-snack", emoji: "🥚", name: "Avocado-Ei-Snackteller", type: "SNACK", description: "Kompakter Snackteller mit Ei, Avocado und knackigen Radieschen.", prepMinutes: 10, ingredients: [["egg", 70], ["avocado", 70], ["radish", 90]], style: "cold", vegetarian: true }),
  recipe({ key: "tuna-radish-bites", emoji: "🐟", name: "Thunfisch-Radieschen-Happen", type: "SNACK", description: "Knackige Radieschenscheiben mit Thunfisch und Kräuter-Hüttenkäse.", prepMinutes: 7, ingredients: [["tuna", 75], ["radish", 120], ["cottageCheese", 45]], style: "cold" }),
  recipe({ key: "salmon-cucumber-rolls", emoji: "🍣", name: "Lachs-Gurken-Röllchen", type: "SNACK", description: "Frische Gurkenröllchen mit Lachs und Ricotta-Kräuterfüllung.", prepMinutes: 9, ingredients: [["salmon", 70], ["cucumber", 140], ["ricotta", 45]], style: "cold" }),
  recipe({ key: "sardine-radish-snack", emoji: "🐟", name: "Sardinen-Radieschen-Snack", type: "SNACK", description: "Mediterraner Snack mit Sardinen, Radieschen und Gurke.", prepMinutes: 5, ingredients: [["sardines", 70], ["radish", 90], ["cucumber", 100], ["lemon", 5]], style: "cold" }),
  recipe({ key: "turkey-avocado-snack-rolls", emoji: "🍗", name: "Puten-Avocado-Snackrollen", type: "SNACK", description: "Kleine Putenrollen mit Avocado und knackiger Gurke.", prepMinutes: 7, ingredients: [["turkey", 80], ["avocado", 55], ["cucumber", 90]], style: "cold" }),
  recipe({ key: "chicken-lettuce-snack-cups", emoji: "🥬", name: "Hähnchen-Salat-Snackbecher", type: "SNACK", description: "Kleine Salatblätter mit Hähnchen, Gurke und Kräutern.", prepMinutes: 12, ingredients: [["chicken", 80], ["lettuce", 70], ["cucumber", 80], ["herbs", 5]], style: "pan" }),
  recipe({ key: "halloumi-cucumber-skewers", emoji: "🧀", name: "Halloumi-Gurken-Spieße", type: "SNACK", description: "Kleine Spieße mit gebratenem Halloumi, Gurke und Paprika.", prepMinutes: 11, ingredients: [["halloumi", 70], ["cucumber", 100], ["pepper", 70]], style: "pan", vegetarian: true }),
  recipe({ key: "feta-artichoke-snack", emoji: "🌿", name: "Feta-Artischocken-Snack", type: "SNACK", description: "Kleine mediterrane Schale mit Feta, Artischocken und Oliven.", prepMinutes: 4, ingredients: [["feta", 55], ["artichoke", 80], ["olives", 25]], style: "bowl", vegetarian: true }),
  recipe({ key: "mozzarella-olive-snack", emoji: "🫒", name: "Mozzarella-Oliven-Snack", type: "SNACK", description: "Milder Mozzarella mit Oliven, Gurke und frischen Kräutern.", prepMinutes: 4, ingredients: [["mozzarella", 70], ["olives", 30], ["cucumber", 90], ["herbs", 5]], style: "bowl", vegetarian: true }),
  recipe({ key: "broccoli-tahini-snack", emoji: "🥦", name: "Brokkoli mit Zitronen-Tahin", type: "SNACK", description: "Gedämpfter Brokkoli mit cremigem Zitronen-Tahin-Dip.", prepMinutes: 10, ingredients: [["broccoli", 150], ["tahini", 20], ["lemon", 7]], style: "pan", vegetarian: true }),
  recipe({ key: "cauliflower-feta-bites", emoji: "🥦", name: "Blumenkohl-Feta-Happen", type: "SNACK", description: "Kleine Ofenhappen aus Blumenkohl, Feta und Ei.", prepMinutes: 22, ingredients: [["cauliflower", 150], ["feta", 55], ["egg", 60]], style: "oven", vegetarian: true }),
  recipe({ key: "zucchini-goat-cheese-bites", emoji: "🥒", name: "Zucchini-Ziegenkäse-Happen", type: "SNACK", description: "Gebratene Zucchinischeiben mit Ziegenkäse und Walnüssen.", prepMinutes: 12, ingredients: [["zucchini", 150], ["goatCheese", 50], ["walnuts", 12]], style: "pan", vegetarian: true }),
  recipe({ key: "pepper-ricotta-boats", emoji: "🫑", name: "Paprikaboote mit Ricotta", type: "SNACK", description: "Knackige Paprikaboote mit Ricotta, Kräutern und Kürbiskernen.", prepMinutes: 7, ingredients: [["pepper", 150], ["ricotta", 70], ["herbs", 5], ["pumpkinSeeds", 10]], style: "cold", vegetarian: true }),
  recipe({ key: "celery-feta-dip-snack", emoji: "🌿", name: "Sellerie mit Feta-Dip", type: "SNACK", description: "Knackige Selleriestangen mit cremigem Feta-Joghurt-Dip.", prepMinutes: 6, ingredients: [["celery", 140], ["feta", 50], ["yogurt", 35], ["herbs", 5]], style: "cold", vegetarian: true }),
  recipe({ key: "radish-goat-cheese-snack", emoji: "🌱", name: "Radieschen-Ziegenkäse-Teller", type: "SNACK", description: "Knackige Radieschen mit Ziegenkäse und Kürbiskernen.", prepMinutes: 5, ingredients: [["radish", 140], ["goatCheese", 50], ["pumpkinSeeds", 12]], style: "cold", vegetarian: true }),
  recipe({ key: "olive-almond-snack", emoji: "🫒", name: "Oliven-Mandel-Snack", type: "SNACK", description: "Kleine salzige Mischung aus Oliven, Mandeln und Kürbiskernen.", prepMinutes: 2, ingredients: [["olives", 40], ["almonds", 22], ["pumpkinSeeds", 12]], style: "bowl", vegetarian: true }),
  recipe({ key: "walnut-feta-snack", emoji: "🌰", name: "Walnuss-Feta-Happen", type: "SNACK", description: "Kleine Feta-Walnuss-Happen mit Gurke und frischen Kräutern.", prepMinutes: 5, ingredients: [["feta", 55], ["walnuts", 18], ["cucumber", 90], ["herbs", 5]], style: "cold", vegetarian: true }),
  recipe({ key: "pumpkin-cottage-snack", emoji: "🌱", name: "Kürbiskern-Hüttenkäse-Snack", type: "SNACK", description: "Hüttenkäse mit Kürbiskernen, Gurke und Kräutern.", prepMinutes: 4, ingredients: [["cottageCheese", 120], ["pumpkinSeeds", 18], ["cucumber", 100], ["herbs", 5]], style: "bowl", vegetarian: true }),
];

export const expandedCuratedRecipes: CuratedRecipe[] = [
  ...breakfastRecipes,
  ...additionalBreakfastRecipes,
  ...lunchRecipes,
  ...additionalLunchRecipes,
  ...dinnerRecipes,
  ...additionalDinnerRecipes,
  ...snackRecipes,
  ...additionalSnackRecipes,
];
