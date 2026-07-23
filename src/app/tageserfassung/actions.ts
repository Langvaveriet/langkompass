"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";


function getText(formData: FormData, field: string): string | null {
  const value = formData.get(field);

  if (typeof value !== "string") {
    return null;
  }

  const trimmedValue = value.trim();

  return trimmedValue.length > 0 ? trimmedValue : null;
}

function getStringList(
  formData: FormData,
  field: string,
): string[] {
  return formData
    .getAll(field)
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.trim())
    .filter(Boolean);
}

function getInteger(formData: FormData, field: string): number | null {
  const value = getText(formData, field);

  if (value === null) {
    return null;
  }

  const parsedValue = Number.parseInt(value, 10);

  return Number.isInteger(parsedValue) ? parsedValue : null;
}

function getDecimal(formData: FormData, field: string): string | null {
  const value = getText(formData, field);

  if (value === null) {
    return null;
  }

  const normalizedValue = value.replace(",", ".");
  const parsedValue = Number(normalizedValue);

  return Number.isFinite(parsedValue) ? normalizedValue : null;
}

function getDate(formData: FormData): {
  inputValue: string;
  databaseValue: Date;
} {
  const value = getText(formData, "entryDate");

  if (value === null || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    redirect("/tageserfassung?error=date");
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);

  if (Number.isNaN(parsedDate.getTime())) {
    redirect("/tageserfassung?error=date");
  }

  return {
    inputValue: value,
    databaseValue: parsedDate,
  };
}

function validateScale(
  value: number | null,
  field: string,
): number | null {
  if (value !== null && (value < 1 || value > 10)) {
    redirect(`/tageserfassung?error=${field}`);
  }

  return value;
}

export async function saveDailyEntry(formData: FormData) {
  const user = await requireUser();

  const submitIntent = getText(formData, "submitIntent");
  const nextStatus =
    submitIntent === "complete" ? "COMPLETED" : "MORNING_DONE";

  const entryDate = getDate(formData);

  const wellbeing = validateScale(
    getInteger(formData, "wellbeing"),
    "wellbeing",
  );

  const energy = validateScale(
    getInteger(formData, "energy"),
    "energy",
  );

  const sleepQuality = validateScale(
    getInteger(formData, "sleepQuality"),
    "sleepQuality",
  );

  const painLevel = validateScale(
    getInteger(formData, "painLevel"),
    "painLevel",
  );

  const stressLevel = validateScale(
    getInteger(formData, "stressLevel"),
    "stressLevel",
  );

  const sleepHours = getDecimal(formData, "sleepHours");

  if (
    sleepHours !== null &&
    (Number(sleepHours) < 0 || Number(sleepHours) > 24)
  ) {
    redirect("/tageserfassung?error=sleepHours");
  }

  const symptomTags = getStringList(formData, "symptomTags");
  const activityTags = getStringList(formData, "activityTags");
  const notes = getText(formData, "notes");

  await prisma.dailyEntry.upsert({
    where: {
      userId_entryDate: {
        userId: user.id,
        entryDate: entryDate.databaseValue,
      },
    },
    update: {
      status: nextStatus,
      wellbeing,
      energy,
      sleepHours,
      sleepQuality,
      painLevel,
      stressLevel,
      symptoms: null,
      symptomTags,
      activityTags,
      notes,
    },
    create: {
      userId: user.id,
      entryDate: entryDate.databaseValue,
      status: nextStatus,
      wellbeing,
      energy,
      sleepHours,
      sleepQuality,
      painLevel,
      stressLevel,
      symptoms: null,
      symptomTags,
      activityTags,
      notes,
    },
  });

  revalidatePath("/");
  revalidatePath("/tageserfassung");

  const completionParameter =
    nextStatus === "COMPLETED" ? "&completed=1" : "";

  redirect(
    `/tageserfassung?date=${entryDate.inputValue}&saved=1${completionParameter}`,
  );
}
