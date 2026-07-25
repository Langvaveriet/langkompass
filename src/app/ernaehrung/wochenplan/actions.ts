"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { MealType } from "@/generated/prisma/enums";
import { buildAutomaticWeekPlan } from "@/lib/nutrition/automatic-week-plan";
import {
  catalogRecipeSnapshot,
  type CuratedRecipe,
} from "@/lib/nutrition/curated-recipes";
import {
  recipeMatchesPreferences,
  recipePreferencesFromProfile,
} from "@/lib/nutrition/recipe-preferences";
import { normalizeRecipeName } from "@/lib/nutrition/recipes";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { upsertUserCatalogRecipe } from "@/lib/nutrition/user-recipes";
import {
  dateInTimeZone,
  defaultTimeZone,
  localDateTimeToUtc,
  timeInTimeZone,
} from "@/lib/user-settings";
import { isIsoDate, isoWeekDates } from "@/lib/nutrition/weekly-plan";

const plannableMealTypes = new Set<MealType>([
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACK",
]);

function formText(formData: FormData, name: string): string | null {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function planDate(formData: FormData): string {
  const date = formText(formData, "plannedDate");
  if (!date || !isIsoDate(date)) {
    redirect("/ernaehrung/wochenplan?error=date");
  }
  return date;
}

function refreshNutrition() {
  revalidatePath("/");
  revalidatePath("/ernaehrung");
  revalidatePath("/ernaehrung/wochenplan");
}

export async function generateAutomaticWeekPlan(formData: FormData) {
  const user = await requireUser();
  const date = planDate(formData);
  const weekDates = isoWeekDates(date);
  const includeSnacks = formText(formData, "includeSnacks") === "1";
  const requestedTypes: Array<Exclude<MealType, "DRINK">> = [
    "BREAKFAST",
    "LUNCH",
    "DINNER",
    ...(includeSnacks ? ["SNACK" as const] : []),
  ];
  const weekStart = new Date(`${weekDates[0]}T00:00:00.000Z`);
  const weekEnd = new Date(`${weekDates[6]}T00:00:00.000Z`);

  const [profile, catalogRecords, favorites, existingEntries] = await Promise.all([
    prisma.healthProfile.findUnique({
      where: { userId: user.id },
      select: {
        preferredDietaryPatterns: true,
        excludedFoodCategories: true,
        avoidHistamine: true,
        maxRecipePrepMinutes: true,
      },
    }),
    prisma.catalogRecipe.findMany({
      where: { active: true, type: { in: requestedTypes } },
      include: { items: { orderBy: { position: "asc" } } },
      orderBy: { key: "asc" },
    }),
    prisma.recipe.findMany({
      where: {
        userId: user.id,
        origin: "CURATED",
        favoriteAt: { not: null },
        archivedAt: null,
      },
      select: { normalizedName: true },
    }),
    prisma.mealPlanEntry.findMany({
      where: {
        userId: user.id,
        plannedDate: { gte: weekStart, lte: weekEnd },
        type: { in: requestedTypes },
      },
      select: { plannedDate: true, type: true },
    }),
  ]);

  const preferences = recipePreferencesFromProfile(profile);
  const favoriteNames = new Set(favorites.map(({ normalizedName }) => normalizedName));
  const catalog = catalogRecords
    .map(catalogRecipeSnapshot)
    .filter((recipe) => recipeMatchesPreferences(recipe, preferences));
  if (catalog.length === 0) {
    redirect(`/ernaehrung/wochenplan?date=${date}&error=automatic-empty`);
  }

  const assignments = buildAutomaticWeekPlan(
    weekDates,
    requestedTypes,
    catalog.map((recipe) => ({
      key: recipe.key,
      type: recipe.type,
      favorite: favoriteNames.has(normalizeRecipeName(recipe.name)),
    })),
  );
  const occupiedSlots = new Set(
    existingEntries.map(
      (entry) => `${entry.plannedDate.toISOString().slice(0, 10)}-${entry.type}`,
    ),
  );
  const openAssignments = assignments.filter(
    (assignment) => !occupiedSlots.has(`${assignment.date}-${assignment.type}`),
  );
  if (openAssignments.length === 0) {
    redirect(`/ernaehrung/wochenplan?date=${date}&generated=0`);
  }

  const catalogByKey = new Map<string, CuratedRecipe>(
    catalog.map((recipe) => [recipe.key, recipe]),
  );
  const selectedKeys = [...new Set(openAssignments.map(({ recipeKey }) => recipeKey))];
  const recipeIds = new Map<string, string>();
  for (const key of selectedKeys) {
    const recipe = catalogByKey.get(key);
    if (!recipe) continue;
    const saved = await upsertUserCatalogRecipe(user.id, recipe);
    recipeIds.set(key, saved.id);
  }

  const result = await prisma.mealPlanEntry.createMany({
    data: openAssignments.flatMap((assignment) => {
      const recipeId = recipeIds.get(assignment.recipeKey);
      return recipeId
        ? [{
            userId: user.id,
            recipeId,
            plannedDate: new Date(`${assignment.date}T00:00:00.000Z`),
            type: assignment.type,
          }]
        : [];
    }),
    skipDuplicates: true,
  });

  refreshNutrition();
  redirect(`/ernaehrung/wochenplan?date=${date}&generated=${result.count}`);
}

export async function planRecipe(formData: FormData) {
  const user = await requireUser();
  const date = planDate(formData);
  const recipeId = formText(formData, "recipeId");
  const type = formText(formData, "type") as MealType | null;

  if (!recipeId || !type || !plannableMealTypes.has(type)) {
    redirect(`/ernaehrung/wochenplan?date=${date}&error=selection`);
  }

  const plannedDate = new Date(`${date}T00:00:00.000Z`);
  const [recipe, existingEntry] = await Promise.all([
    prisma.recipe.findFirst({
      where: { id: recipeId, userId: user.id, archivedAt: null, type },
      select: { id: true },
    }),
    prisma.mealPlanEntry.findUnique({
      where: {
        userId_plannedDate_type: {
          userId: user.id,
          plannedDate,
          type,
        },
      },
      select: { completedAt: true },
    }),
  ]);

  if (!recipe) {
    redirect(`/ernaehrung/wochenplan?date=${date}&error=recipe`);
  }
  if (existingEntry?.completedAt) {
    redirect(`/ernaehrung/wochenplan?date=${date}&error=completed`);
  }

  await prisma.mealPlanEntry.upsert({
    where: {
      userId_plannedDate_type: {
        userId: user.id,
        plannedDate,
        type,
      },
    },
    update: { recipeId: recipe.id },
    create: {
      userId: user.id,
      recipeId: recipe.id,
      plannedDate,
      type,
    },
  });

  refreshNutrition();
  redirect(`/ernaehrung/wochenplan?date=${date}&saved=1`);
}

export async function removePlannedMeal(formData: FormData) {
  const user = await requireUser();
  const date = planDate(formData);
  const planEntryId = formText(formData, "planEntryId");
  if (!planEntryId) {
    redirect(`/ernaehrung/wochenplan?date=${date}&error=selection`);
  }

  const result = await prisma.mealPlanEntry.deleteMany({
    where: {
      id: planEntryId,
      userId: user.id,
      plannedDate: new Date(`${date}T00:00:00.000Z`),
      completedAt: null,
      mealId: null,
    },
  });

  if (result.count === 0) {
    redirect(`/ernaehrung/wochenplan?date=${date}&error=completed`);
  }

  refreshNutrition();
  redirect(`/ernaehrung/wochenplan?date=${date}&removed=1`);
}

export async function logPlannedMeal(formData: FormData) {
  const user = await requireUser();
  const date = planDate(formData);
  const planEntryId = formText(formData, "planEntryId");
  if (!planEntryId) {
    redirect(`/ernaehrung/wochenplan?date=${date}&error=selection`);
  }

  const [settings, planEntry] = await Promise.all([
    prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: { timeZone: true },
    }),
    prisma.mealPlanEntry.findFirst({
      where: {
        id: planEntryId,
        userId: user.id,
        plannedDate: new Date(`${date}T00:00:00.000Z`),
      },
      include: {
        recipe: {
          include: { items: { orderBy: { position: "asc" } } },
        },
      },
    }),
  ]);

  if (!planEntry || planEntry.recipe.items.length === 0) {
    redirect(`/ernaehrung/wochenplan?date=${date}&error=recipe`);
  }
  if (planEntry.completedAt || planEntry.mealId) {
    redirect(`/ernaehrung/wochenplan?date=${date}&error=completed`);
  }

  const timeZone = settings?.timeZone ?? defaultTimeZone;
  if (date > dateInTimeZone(new Date(), timeZone)) {
    redirect(`/ernaehrung/wochenplan?date=${date}&error=future`);
  }
  const completedAt = new Date();

  try {
    await prisma.$transaction(async (transaction) => {
      const claim = await transaction.mealPlanEntry.updateMany({
        where: {
          id: planEntry.id,
          userId: user.id,
          completedAt: null,
          mealId: null,
        },
        data: { completedAt },
      });
      if (claim.count === 0) {
        throw new Error("PLAN_ALREADY_COMPLETED");
      }

      const entryDate = new Date(`${date}T00:00:00.000Z`);
      const dailyEntry = await transaction.dailyEntry.upsert({
        where: { userId_entryDate: { userId: user.id, entryDate } },
        update: {},
        create: { userId: user.id, entryDate },
      });
      const meal = await transaction.meal.create({
        data: {
          dailyEntryId: dailyEntry.id,
          type: planEntry.type,
          consumedAt: localDateTimeToUtc(
            date,
            timeInTimeZone(completedAt, timeZone),
            timeZone,
          ),
          items: {
            create: planEntry.recipe.items.map((item) => ({
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
        select: { id: true },
      });

      await transaction.mealPlanEntry.update({
        where: { id: planEntry.id },
        data: { mealId: meal.id },
      });
    });
  } catch {
    redirect(`/ernaehrung/wochenplan?date=${date}&error=completed`);
  }

  refreshNutrition();
  redirect(`/ernaehrung/wochenplan?date=${date}&logged=1`);
}
