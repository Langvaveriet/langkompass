import type {
  DietaryPattern,
  FoodCategory,
} from "@/generated/prisma/enums";
import type { CuratedRecipe } from "@/lib/nutrition/curated-recipes";

export type RecipePreferences = {
  dietaryPatterns: readonly DietaryPattern[];
  excludedFoodCategories: readonly FoodCategory[];
  avoidHistamine: boolean;
  maxPrepMinutes: number | null;
};

export function recipePreferencesFromProfile(profile: {
  preferredDietaryPatterns: DietaryPattern[];
  excludedFoodCategories: FoodCategory[];
  avoidHistamine: boolean;
  maxRecipePrepMinutes: number | null;
} | null | undefined): RecipePreferences {
  return {
    dietaryPatterns: profile?.preferredDietaryPatterns ?? [],
    excludedFoodCategories: profile?.excludedFoodCategories ?? [],
    avoidHistamine: profile?.avoidHistamine ?? false,
    maxPrepMinutes: profile?.maxRecipePrepMinutes ?? null,
  };
}

const histamineTraits = new Set([
  "HISTAMINE_RICH",
  "HISTAMINE_LIBERATOR",
]);

export function recipeMatchesPreferences(
  recipe: CuratedRecipe,
  preferences: RecipePreferences,
): boolean {
  if (
    !preferences.dietaryPatterns.every((pattern) =>
      recipe.dietaryPatterns.includes(pattern),
    )
  ) {
    return false;
  }

  const excludedCategories = new Set(preferences.excludedFoodCategories);
  if (recipe.items.some((item) => excludedCategories.has(item.category))) {
    return false;
  }

  if (
    preferences.avoidHistamine &&
    recipe.items.some((item) =>
      (item.traits ?? []).some((trait) => histamineTraits.has(trait)),
    )
  ) {
    return false;
  }

  return preferences.maxPrepMinutes === null ||
    recipe.prepMinutes <= preferences.maxPrepMinutes;
}

export function hasRecipePreferences(
  preferences: RecipePreferences,
): boolean {
  return preferences.dietaryPatterns.length > 0 ||
    preferences.excludedFoodCategories.length > 0 ||
    preferences.avoidHistamine ||
    preferences.maxPrepMinutes !== null;
}
