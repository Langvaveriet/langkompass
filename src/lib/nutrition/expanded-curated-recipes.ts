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

export const expandedCuratedRecipes: CuratedRecipe[] = [
  ...breakfastRecipes,
  ...lunchRecipes,
  ...dinnerRecipes,
  ...snackRecipes,
];
