"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import type {
  ActivityLevel,
  CalorieFormulaSex,
  WeightGoal,
} from "@/generated/prisma/enums";

const LOCAL_USER_EMAIL = "local-user@langkompass.invalid";
const formulaSexValues = new Set<CalorieFormulaSex>(["FEMALE", "MALE"]);
const activityLevelValues = new Set<ActivityLevel>([
  "SEDENTARY", "LIGHT", "MODERATE", "HIGH", "VERY_HIGH",
]);
const weightGoalValues = new Set<WeightGoal>(["LOSE", "MAINTAIN", "GAIN"]);

function optionalText(formData: FormData, field: string): string | null {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function optionalInteger(formData: FormData, field: string): number | null {
  const value = optionalText(formData, field);

  if (value === null) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isFinite(parsedValue) ? parsedValue : null;
}

function optionalDecimal(formData: FormData, field: string): string | null {
  const value = optionalText(formData, field);

  if (value === null) {
    return null;
  }

  const normalizedValue = value.replace(",", ".");
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? normalizedValue : null;
}

function optionalDate(formData: FormData, field: string): Date | null {
  const value = optionalText(formData, field);

  if (value === null) {
    return null;
  }

  const parsedValue = new Date(`${value}T00:00:00.000Z`);

  return Number.isNaN(parsedValue.getTime()) ? null : parsedValue;
}

export async function saveHealthProfile(formData: FormData) {
  const firstName = optionalText(formData, "firstName");
  const lastName = optionalText(formData, "lastName");
  const dateOfBirth = optionalDate(formData, "dateOfBirth");
  const heightCm = optionalInteger(formData, "height");
  const weightKg = optionalDecimal(formData, "weight");
  const calorieFormulaSexValue = optionalText(formData, "calorieFormulaSex") as CalorieFormulaSex | null;
  const activityLevelValue = optionalText(formData, "activityLevel") as ActivityLevel | null;
  const weightGoalValue = optionalText(formData, "weightGoal") as WeightGoal | null;
  const manualDailyCalorieTarget = optionalInteger(formData, "manualDailyCalorieTarget");
  const primaryGoal = optionalText(formData, "primaryGoal");
  const activityGoal = optionalText(formData, "activityGoal");

  if (heightCm !== null && (heightCm < 50 || heightCm > 250)) {
    redirect("/gesundheitsprofil?error=height");
  }

  if (
    weightKg !== null &&
    (Number(weightKg) < 20 || Number(weightKg) > 500)
  ) {
    redirect("/gesundheitsprofil?error=weight");
  }

  if (
    (calorieFormulaSexValue && !formulaSexValues.has(calorieFormulaSexValue)) ||
    (activityLevelValue && !activityLevelValues.has(activityLevelValue)) ||
    (weightGoalValue && !weightGoalValues.has(weightGoalValue)) ||
    (manualDailyCalorieTarget !== null &&
      (manualDailyCalorieTarget < 1000 || manualDailyCalorieTarget > 6000))
  ) {
    redirect("/gesundheitsprofil?error=calories");
  }

  const calorieFormulaSex = calorieFormulaSexValue || null;
  const activityLevel = activityLevelValue || null;
  const weightGoal = weightGoalValue || null;

  const user = await prisma.user.upsert({
    where: {
      email: LOCAL_USER_EMAIL,
    },
    update: {
      name:
        [firstName, lastName].filter(Boolean).join(" ") ||
        undefined,
    },
    create: {
      email: LOCAL_USER_EMAIL,
      name:
        [firstName, lastName].filter(Boolean).join(" ") ||
        null,
    },
  });

  await prisma.healthProfile.upsert({
    where: {
      userId: user.id,
    },
    update: {
      firstName,
      lastName,
      dateOfBirth,
      heightCm,
      weightKg,
      calorieFormulaSex,
      activityLevel,
      weightGoal,
      manualDailyCalorieTarget,
      primaryGoal,
      activityGoal,
    },
    create: {
      userId: user.id,
      firstName,
      lastName,
      dateOfBirth,
      heightCm,
      weightKg,
      calorieFormulaSex,
      activityLevel,
      weightGoal,
      manualDailyCalorieTarget,
      primaryGoal,
      activityGoal,
    },
  });

  revalidatePath("/");
  revalidatePath("/gesundheitsprofil");

  redirect("/gesundheitsprofil?saved=1");
}
