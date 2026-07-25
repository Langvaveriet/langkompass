import type { CuratedRecipe } from "@/lib/nutrition/curated-recipes";
import { normalizeRecipeName } from "@/lib/nutrition/recipes";
import { prisma } from "@/lib/prisma";

export async function upsertUserCatalogRecipe(
  userId: string,
  suggestion: CuratedRecipe,
  favorite = false,
) {
  const normalizedName = normalizeRecipeName(suggestion.name);
  const favoriteAt = favorite ? new Date() : null;

  return prisma.$transaction(async (transaction) => {
    const existingRecipe = await transaction.recipe.findUnique({
      where: { userId_normalizedName: { userId, normalizedName } },
      select: { id: true },
    });
    const metadata = {
      name: suggestion.name,
      type: suggestion.type,
      origin: "CURATED" as const,
      description: suggestion.description,
      prepMinutes: suggestion.prepMinutes,
      servings: suggestion.servings,
      instructions: suggestion.instructions.join("\n"),
      carbohydrateGrams: suggestion.carbohydrateGrams,
      proteinGrams: suggestion.proteinGrams,
      fatGrams: suggestion.fatGrams,
      dietaryPatterns: suggestion.dietaryPatterns,
      sourceLabel: suggestion.sourceLabel ?? "LångKompass Katalog",
      sourceUrl: suggestion.sourceUrl ?? null,
      archivedAt: null,
    };
    const recipe = existingRecipe
      ? await transaction.recipe.update({
          where: { id: existingRecipe.id },
          data: {
            ...metadata,
            ...(favorite ? { favoriteAt } : {}),
          },
          select: { id: true, type: true },
        })
      : await transaction.recipe.create({
          data: {
            userId,
            normalizedName,
            ...metadata,
            favoriteAt,
          },
          select: { id: true, type: true },
        });

    if (existingRecipe) {
      await transaction.recipeItem.deleteMany({
        where: { recipeId: recipe.id, userId },
      });
    }
    await transaction.recipeItem.createMany({
      data: suggestion.items.map((item, position) => ({
        userId,
        recipeId: recipe.id,
        position,
        foodKey: item.foodKey,
        name: item.name,
        category: item.category,
        portion: "MEDIUM" as const,
        quantity: item.quantity,
        unit: item.unit,
        energyKcal: item.energyKcal,
        traits: item.traits ?? [],
      })),
    });

    return recipe;
  });
}
