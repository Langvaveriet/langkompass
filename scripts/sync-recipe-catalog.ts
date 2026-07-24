import "dotenv/config";

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  curatedRecipeImportSchema,
  curatedRecipes,
} from "../src/lib/nutrition/curated-recipes";
import { prisma } from "../src/lib/prisma";

async function inputRecipes() {
  const filePath = process.argv[2];
  if (!filePath) return curatedRecipeImportSchema.parse(curatedRecipes);

  const content = await readFile(resolve(filePath), "utf8");
  return curatedRecipeImportSchema.parse(JSON.parse(content));
}

async function main() {
  const recipes = await inputRecipes();
  const uniqueKeys = new Set(recipes.map((recipe) => recipe.key));
  if (uniqueKeys.size !== recipes.length) {
    throw new Error("Der Rezeptimport enthält doppelte Schlüssel.");
  }

  await prisma.$transaction(async (transaction) => {
    for (const recipe of recipes) {
      await transaction.catalogRecipe.upsert({
        where: { key: recipe.key },
        update: {
          name: recipe.name,
          emoji: recipe.emoji,
          type: recipe.type,
          description: recipe.description,
          prepMinutes: recipe.prepMinutes,
          servings: recipe.servings,
          carbohydrateGrams: recipe.carbohydrateGrams,
          proteinGrams: recipe.proteinGrams,
          fatGrams: recipe.fatGrams,
          dietaryPatterns: recipe.dietaryPatterns,
          instructions: recipe.instructions.join("\n"),
          sourceLabel: recipe.sourceLabel ?? "LångKompass Katalog",
          sourceUrl: recipe.sourceUrl ?? null,
          active: true,
        },
        create: {
          key: recipe.key,
          name: recipe.name,
          emoji: recipe.emoji,
          type: recipe.type,
          description: recipe.description,
          prepMinutes: recipe.prepMinutes,
          servings: recipe.servings,
          carbohydrateGrams: recipe.carbohydrateGrams,
          proteinGrams: recipe.proteinGrams,
          fatGrams: recipe.fatGrams,
          dietaryPatterns: recipe.dietaryPatterns,
          instructions: recipe.instructions.join("\n"),
          sourceLabel: recipe.sourceLabel ?? "LångKompass Katalog",
          sourceUrl: recipe.sourceUrl ?? null,
        },
      });

      await transaction.catalogRecipeItem.deleteMany({
        where: { catalogRecipeKey: recipe.key },
      });
      await transaction.catalogRecipeItem.createMany({
        data: recipe.items.map((item, position) => ({
          catalogRecipeKey: recipe.key,
          position,
          foodKey: item.foodKey ?? null,
          name: item.name,
          category: item.category,
          quantity: item.quantity,
          unit: item.unit,
          energyKcal: item.energyKcal,
          traits: item.traits ?? [],
        })),
      });
    }
  });

  console.log(`${recipes.length} Katalogrezepte wurden synchronisiert.`);
}

main()
  .catch((error: unknown) => {
    console.error(
      error instanceof Error ? error.message : "Der Rezeptimport ist fehlgeschlagen.",
    );
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
