"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { MealType, PortionSize } from "@/generated/prisma/enums";
import {
  catalogRecipeSnapshot,
  type CuratedRecipe,
} from "@/lib/nutrition/curated-recipes";
import { foodCatalogByKey } from "@/lib/nutrition/food-catalog";
import {
  allowedPostMealSymptoms,
  allowedReactionDelays,
} from "@/lib/nutrition/post-meal-reactions";
import {
  normalizeRecipeName,
  recipeNameSchema,
} from "@/lib/nutrition/recipes";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  defaultTimeZone,
  localDateTimeToUtc,
  timeInTimeZone,
} from "@/lib/user-settings";

const mealTypes = new Set<MealType>(["BREAKFAST", "LUNCH", "DINNER", "SNACK", "DRINK"]);
const portionSizes = new Set<PortionSize>(["SMALL", "MEDIUM", "LARGE"]);

function text(formData: FormData, field: string): string | null {
  const value = formData.get(field);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function selectedDate(formData: FormData): string {
  const value = text(formData, "entryDate");
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) redirect("/ernaehrung?error=date");
  return value;
}

async function upsertCuratedRecipe(userId: string, suggestion: CuratedRecipe) {
  const normalizedName = normalizeRecipeName(suggestion.name);

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
      sourceLabel: "LångKompass Katalog",
      sourceUrl: null,
      archivedAt: null,
    };
    const recipe = existingRecipe
      ? await transaction.recipe.update({
          where: { id: existingRecipe.id },
          data: metadata,
          select: { id: true, type: true },
        })
      : await transaction.recipe.create({
          data: {
            userId,
            normalizedName,
            ...metadata,
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

async function catalogSuggestion(key: string): Promise<CuratedRecipe | null> {
  const recipe = await prisma.catalogRecipe.findFirst({
    where: { key, active: true },
    include: { items: { orderBy: { position: "asc" } } },
  });

  return recipe ? catalogRecipeSnapshot(recipe) : null;
}

export async function saveMeal(formData: FormData) {
  const user = await requireUser();
  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
    select: { timeZone: true },
  });
  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const date = selectedDate(formData);
  const time = text(formData, "consumedTime");
  const typeValue = text(formData, "type") as MealType | null;
  const mealId = text(formData, "mealId");
  const postMealSymptomTags = formData
    .getAll("postMealSymptomTags")
    .filter((value): value is string => typeof value === "string")
    .filter((value) => allowedPostMealSymptoms.has(value));
  const reactionDelayValue = text(formData, "reactionDelayMinutes");
  const parsedReactionDelay = reactionDelayValue === null
    ? null
    : Number(reactionDelayValue);
  const reactionDelayMinutes =
    postMealSymptomTags.length > 0 &&
    parsedReactionDelay !== null &&
    allowedReactionDelays.has(parsedReactionDelay)
      ? parsedReactionDelay
      : null;

  if (!time || !/^\d{2}:\d{2}$/.test(time) || !typeValue || !mealTypes.has(typeValue)) {
    redirect(`/ernaehrung?date=${date}&error=meal`);
  }

  const selectedKeys = formData
    .getAll("foodKeys")
    .filter((value): value is string => typeof value === "string")
    .filter((key) => foodCatalogByKey.has(key));
  const customFood = text(formData, "customFood");
  const customQuantityValue = text(formData, "customQuantity");
  const customQuantity = customQuantityValue
    ? Number(customQuantityValue.replace(",", "."))
    : null;
  const hasValidCustomQuantity =
    customQuantity !== null &&
    Number.isFinite(customQuantity) &&
    customQuantity > 0 &&
    customQuantity <= 5000;

  if (selectedKeys.length === 0 && !customFood) {
    redirect(`/ernaehrung?date=${date}&error=food`);
  }

  const entryDate = new Date(`${date}T00:00:00.000Z`);
  const dailyEntry = await prisma.dailyEntry.upsert({
    where: { userId_entryDate: { userId: user.id, entryDate } },
    update: {},
    create: { userId: user.id, entryDate },
  });
  const items = [
    ...selectedKeys.map((key) => {
      const food = foodCatalogByKey.get(key)!;
      const portionValue = text(formData, `portion-${key}`) as PortionSize | null;
      const portion = portionValue && portionSizes.has(portionValue)
        ? portionValue
        : "MEDIUM";

      return {
        foodKey: food.key,
        name: food.name,
        category: food.category,
        portion,
        quantity: food.portions[portion],
        unit: food.unit,
        energyKcal: Math.round(
          (food.kcalPer100 * food.portions[portion]) / 100,
        ),
        traits: food.traits,
      };
    }),
    ...(customFood
      ? [{
          foodKey: null,
          name: customFood,
          category: "OTHER" as const,
          portion: "MEDIUM" as const,
          quantity: hasValidCustomQuantity ? customQuantity : null,
          unit: hasValidCustomQuantity ? "GRAM" as const : null,
          energyKcal: null,
          traits: [],
        }]
      : []),
  ];
  const data = {
    type: typeValue,
    consumedAt: localDateTimeToUtc(date, time, timeZone),
    notes: text(formData, "notes"),
    postMealSymptomTags,
    reactionDelayMinutes,
    items: { create: items },
  };

  if (mealId) {
    const existingMeal = await prisma.meal.findFirst({
      where: { id: mealId, dailyEntry: { userId: user.id } },
      select: { id: true },
    });
    if (!existingMeal) redirect(`/ernaehrung?date=${date}&error=meal`);

    await prisma.$transaction([
      prisma.mealItem.deleteMany({ where: { mealId } }),
      prisma.meal.update({ where: { id: mealId }, data }),
    ]);
  } else {
    await prisma.meal.create({ data: { dailyEntryId: dailyEntry.id, ...data } });
  }

  revalidatePath("/");
  revalidatePath("/ernaehrung");
  redirect(`/ernaehrung?date=${date}&saved=1`);
}

export async function deleteMeal(formData: FormData) {
  const user = await requireUser();
  const date = selectedDate(formData);
  const mealId = text(formData, "mealId");
  if (!mealId) redirect(`/ernaehrung?date=${date}&error=meal`);

  await prisma.meal.deleteMany({ where: { id: mealId, dailyEntry: { userId: user.id } } });

  revalidatePath("/");
  revalidatePath("/ernaehrung");
  redirect(`/ernaehrung?date=${date}&deleted=1`);
}

export async function repeatMeal(formData: FormData) {
  const user = await requireUser();
  const date = selectedDate(formData);
  const sourceMealId = text(formData, "sourceMealId");
  if (!sourceMealId) redirect(`/ernaehrung?date=${date}&error=meal`);

  const [settings, sourceMeal] = await Promise.all([
    prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: { timeZone: true },
    }),
    prisma.meal.findFirst({
      where: { id: sourceMealId, dailyEntry: { userId: user.id } },
      include: { items: true },
    }),
  ]);

  if (!sourceMeal || sourceMeal.items.length === 0) {
    redirect(`/ernaehrung?date=${date}&error=meal`);
  }

  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const entryDate = new Date(`${date}T00:00:00.000Z`);
  const dailyEntry = await prisma.dailyEntry.upsert({
    where: { userId_entryDate: { userId: user.id, entryDate } },
    update: {},
    create: { userId: user.id, entryDate },
  });

  await prisma.meal.create({
    data: {
      dailyEntryId: dailyEntry.id,
      type: sourceMeal.type,
      consumedAt: localDateTimeToUtc(
        date,
        timeInTimeZone(sourceMeal.consumedAt, timeZone),
        timeZone,
      ),
      items: {
        create: sourceMeal.items.map((item) => ({
          foodKey: item.foodKey,
          name: item.name,
          category: item.category,
          portion: item.portion,
          quantity: item.quantity,
          unit: item.unit,
          energyKcal: item.energyKcal,
          traits: item.traits,
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/ernaehrung");
  redirect(`/ernaehrung?date=${date}&repeated=1`);
}

export async function saveMealAsRecipe(formData: FormData) {
  const user = await requireUser();
  const date = selectedDate(formData);
  const mealId = text(formData, "mealId");
  const parsedName = recipeNameSchema.safeParse(text(formData, "recipeName"));

  if (!mealId || !parsedName.success) {
    redirect(`/ernaehrung?date=${date}&error=recipe-name`);
  }

  const sourceMeal = await prisma.meal.findFirst({
    where: { id: mealId, dailyEntry: { userId: user.id } },
    include: { items: true },
  });

  if (!sourceMeal || sourceMeal.items.length === 0) {
    redirect(`/ernaehrung?date=${date}&error=meal`);
  }

  const name = parsedName.data;
  const normalizedName = normalizeRecipeName(name);

  await prisma.$transaction(async (transaction) => {
    const existingRecipe = await transaction.recipe.findUnique({
      where: { userId_normalizedName: { userId: user.id, normalizedName } },
      select: { id: true },
    });
    const recipe = existingRecipe
      ? await transaction.recipe.update({
          where: { id: existingRecipe.id },
          data: {
            name,
            type: sourceMeal.type,
            origin: "USER",
            description: null,
            prepMinutes: null,
            servings: null,
            instructions: null,
            carbohydrateGrams: null,
            proteinGrams: null,
            fatGrams: null,
            dietaryPatterns: [],
            sourceLabel: null,
            sourceUrl: null,
            archivedAt: null,
          },
          select: { id: true },
        })
      : await transaction.recipe.create({
          data: {
            userId: user.id,
            name,
            normalizedName,
            type: sourceMeal.type,
          },
          select: { id: true },
        });

    if (existingRecipe) {
      await transaction.recipeItem.deleteMany({
        where: { recipeId: recipe.id, userId: user.id },
      });
    }

    await transaction.recipeItem.createMany({
      data: sourceMeal.items.map((item, position) => ({
        userId: user.id,
        recipeId: recipe.id,
        position,
        foodKey: item.foodKey,
        name: item.name,
        category: item.category,
        portion: item.portion,
        quantity: item.quantity,
        unit: item.unit,
        energyKcal: item.energyKcal,
        traits: item.traits,
      })),
    });
  });

  revalidatePath("/ernaehrung");
  redirect(`/ernaehrung?date=${date}&recipeSaved=1`);
}

export async function useRecipe(formData: FormData) {
  const user = await requireUser();
  const date = selectedDate(formData);
  const recipeId = text(formData, "recipeId");
  if (!recipeId) redirect(`/ernaehrung?date=${date}&error=recipe`);

  const [settings, recipe] = await Promise.all([
    prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: { timeZone: true },
    }),
    prisma.recipe.findFirst({
      where: { id: recipeId, userId: user.id, archivedAt: null },
      include: { items: { orderBy: { position: "asc" } } },
    }),
  ]);

  if (!recipe || recipe.items.length === 0) {
    redirect(`/ernaehrung?date=${date}&error=recipe`);
  }

  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const entryDate = new Date(`${date}T00:00:00.000Z`);
  const dailyEntry = await prisma.dailyEntry.upsert({
    where: { userId_entryDate: { userId: user.id, entryDate } },
    update: {},
    create: { userId: user.id, entryDate },
  });

  await prisma.meal.create({
    data: {
      dailyEntryId: dailyEntry.id,
      type: recipe.type,
      consumedAt: localDateTimeToUtc(
        date,
        timeInTimeZone(new Date(), timeZone),
        timeZone,
      ),
      items: {
        create: recipe.items.map((item) => ({
          foodKey: item.foodKey,
          name: item.name,
          category: item.category,
          portion: item.portion,
          quantity: item.quantity,
          unit: item.unit,
          energyKcal: item.energyKcal,
          traits: item.traits,
        })),
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/ernaehrung");
  redirect(`/ernaehrung?date=${date}&recipeUsed=1`);
}

export async function archiveRecipe(formData: FormData) {
  const user = await requireUser();
  const date = selectedDate(formData);
  const recipeId = text(formData, "recipeId");
  if (!recipeId) redirect(`/ernaehrung?date=${date}&error=recipe`);

  const result = await prisma.recipe.updateMany({
    where: { id: recipeId, userId: user.id, archivedAt: null },
    data: { archivedAt: new Date() },
  });

  if (result.count === 0) {
    redirect(`/ernaehrung?date=${date}&error=recipe`);
  }

  revalidatePath("/ernaehrung");
  redirect(`/ernaehrung?date=${date}&recipeArchived=1`);
}

export async function saveSuggestedRecipe(formData: FormData) {
  const user = await requireUser();
  const date = selectedDate(formData);
  const suggestionKey = text(formData, "suggestionKey");
  const suggestion = suggestionKey
    ? await catalogSuggestion(suggestionKey)
    : null;

  if (!suggestion) {
    redirect(`/ernaehrung?date=${date}&error=suggestion`);
  }

  await upsertCuratedRecipe(user.id, suggestion);
  revalidatePath("/ernaehrung");
  revalidatePath("/ernaehrung/wochenplan");
  redirect(`/ernaehrung?date=${date}&suggestionSaved=1&suggest=${suggestion.key}`);
}

export async function planSuggestedRecipe(formData: FormData) {
  const user = await requireUser();
  const date = selectedDate(formData);
  const suggestionKey = text(formData, "suggestionKey");
  const suggestion = suggestionKey
    ? await catalogSuggestion(suggestionKey)
    : null;

  if (!suggestion) {
    redirect(`/ernaehrung?date=${date}&error=suggestion`);
  }

  const plannedDate = new Date(`${date}T00:00:00.000Z`);
  const existingPlan = await prisma.mealPlanEntry.findUnique({
    where: {
      userId_plannedDate_type: {
        userId: user.id,
        plannedDate,
        type: suggestion.type,
      },
    },
    select: { completedAt: true },
  });
  if (existingPlan?.completedAt) {
    redirect(`/ernaehrung?date=${date}&error=plan-completed`);
  }

  const recipe = await upsertCuratedRecipe(user.id, suggestion);
  await prisma.mealPlanEntry.upsert({
    where: {
      userId_plannedDate_type: {
        userId: user.id,
        plannedDate,
        type: suggestion.type,
      },
    },
    update: { recipeId: recipe.id },
    create: {
      userId: user.id,
      recipeId: recipe.id,
      plannedDate,
      type: suggestion.type,
    },
  });

  revalidatePath("/");
  revalidatePath("/ernaehrung");
  revalidatePath("/ernaehrung/wochenplan");
  redirect(`/ernaehrung?date=${date}&suggestionPlanned=1&suggest=${suggestion.key}`);
}
