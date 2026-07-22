"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";

const LOCAL_USER_EMAIL = "local-user@langkompass.invalid";

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
      primaryGoal,
      activityGoal,
    },
  });

  revalidatePath("/");
  revalidatePath("/gesundheitsprofil");

  redirect("/gesundheitsprofil?saved=1");
}
