type IngredientInput = {
  name: string;
  category: string;
};

type AlternativeRecipeInput = {
  id: string;
  dietaryPatterns: string[];
  items: IngredientInput[];
};

export type MicronutrientSourceHint = {
  nutrient: string;
  sources: string[];
};

const nutrientRules: Array<{
  nutrient: string;
  keywords: string[];
  categories?: string[];
}> = [
  { nutrient: "Omega-3-Fettsäuren", keywords: ["lachs", "sardine", "makrele", "hering", "walnuss", "chia", "leinsamen"] },
  { nutrient: "Calcium", keywords: ["joghurt", "feta", "käse", "halloumi", "mandel", "sesam"], categories: ["DAIRY"] },
  { nutrient: "Magnesium", keywords: ["mandel", "walnuss", "nuss", "kürbiskern", "spinat", "avocado", "kakao"], categories: ["NUT_SEED"] },
  { nutrient: "Eisen", keywords: ["rind", "lamm", "leber", "spinat", "linse", "kürbiskern"], categories: ["MEAT", "LEGUME"] },
  { nutrient: "Folat", keywords: ["spinat", "brokkoli", "spargel", "avocado", "blattsalat", "rosenkohl"] },
  { nutrient: "Vitamin C", keywords: ["paprika", "brokkoli", "zitrone", "beere", "blumenkohl", "rosenkohl"] },
  { nutrient: "Vitamin B12", keywords: ["ei", "lachs", "sardine", "thunfisch", "fleisch", "joghurt", "käse"], categories: ["EGG", "MEAT", "FISH_SEAFOOD", "DAIRY"] },
  { nutrient: "Kalium", keywords: ["avocado", "spinat", "zucchini", "pilz", "tomate", "lachs"] },
];

export function buildMicronutrientSourceHints(
  ingredients: IngredientInput[],
): MicronutrientSourceHint[] {
  return nutrientRules.flatMap((rule) => {
    const sources = ingredients
      .filter((ingredient) => {
        const normalizedName = ingredient.name.toLocaleLowerCase("de-DE");
        return rule.keywords.some((keyword) => normalizedName.includes(keyword))
          || rule.categories?.includes(ingredient.category);
      })
      .map(({ name }) => name)
      .filter((name, index, values) => values.indexOf(name) === index);

    return sources.length > 0 ? [{ nutrient: rule.nutrient, sources }] : [];
  });
}

export function rankRecipeAlternatives<T extends AlternativeRecipeInput>(
  current: AlternativeRecipeInput,
  candidates: T[],
  limit = 3,
): T[] {
  const currentPatterns = new Set(current.dietaryPatterns);
  const currentCategories = new Set(current.items.map(({ category }) => category));

  return [...candidates]
    .map((candidate) => ({
      candidate,
      score:
        candidate.dietaryPatterns.filter((pattern) => currentPatterns.has(pattern)).length * 3
        + new Set(candidate.items.map(({ category }) => category).filter((category) => currentCategories.has(category))).size,
    }))
    .sort((left, right) => right.score - left.score || left.candidate.id.localeCompare(right.candidate.id))
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
