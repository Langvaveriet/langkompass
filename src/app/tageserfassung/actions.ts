"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  defaultTimeZone,
  localDateTimeToUtc,
} from "@/lib/user-settings";

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

function getWeight(formData: FormData): string | null {
  const value = getText(formData, "weightKg");

  if (value === null) {
    return null;
  }

  const normalizedValue = value.replace(",", ".");

  if (!/^\d{2,3}(?:\.\d{1,2})?$/.test(normalizedValue)) {
    redirect("/tageserfassung?error=weightKg");
  }

  const parsedValue = Number(normalizedValue);

  if (parsedValue < 20 || parsedValue > 400) {
    redirect("/tageserfassung?error=weightKg");
  }

  return normalizedValue;
}

export async function saveDailyEntry(formData: FormData) {
  const user = await requireUser();
  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
    select: { timeZone: true },
  });
  const timeZone = settings?.timeZone ?? defaultTimeZone;

  const submitIntent = getText(formData, "submitIntent");
  const completionRequested = submitIntent === "complete";

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
  const weightKg = getWeight(formData);
  const weightMeasuredTime = getText(formData, "weightMeasuredTime");

  if (
    sleepHours !== null &&
    (Number(sleepHours) < 0 || Number(sleepHours) > 24)
  ) {
    redirect("/tageserfassung?error=sleepHours");
  }

  if (
    weightKg !== null &&
    (weightMeasuredTime === null ||
      !/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(weightMeasuredTime))
  ) {
    redirect("/tageserfassung?error=weightMeasuredTime");
  }

  const symptomTags = getStringList(formData, "symptomTags");
  const activityTags = getStringList(formData, "activityTags");
  const notes = getText(formData, "notes");

  await prisma.$transaction(async (transaction) => {
    const existingEntry = await transaction.dailyEntry.findUnique({
      where: {
        userId_entryDate: {
          userId: user.id,
          entryDate: entryDate.databaseValue,
        },
      },
      select: { status: true },
    });
    const nextStatus =
      completionRequested || existingEntry?.status === "COMPLETED"
        ? "COMPLETED"
        : "MORNING_DONE";

    const dailyEntry = await transaction.dailyEntry.upsert({
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

    if (weightKg !== null && weightMeasuredTime !== null) {
      const measuredAt = localDateTimeToUtc(
        entryDate.inputValue,
        weightMeasuredTime,
        timeZone,
      );

      await transaction.bodyMeasurement.upsert({
        where: {
          dailyEntryId_type: {
            dailyEntryId: dailyEntry.id,
            type: "WEIGHT",
          },
        },
        update: {
          value: weightKg,
          measuredAt,
          unit: "KILOGRAM",
          source: "MANUAL",
        },
        create: {
          userId: user.id,
          dailyEntryId: dailyEntry.id,
          type: "WEIGHT",
          value: weightKg,
          unit: "KILOGRAM",
          measuredAt,
          source: "MANUAL",
        },
      });
    } else {
      await transaction.bodyMeasurement.deleteMany({
        where: {
          userId: user.id,
          dailyEntryId: dailyEntry.id,
          type: "WEIGHT",
        },
      });
    }
  });

  revalidatePath("/");
  revalidatePath("/tageserfassung");

  const completionParameter = completionRequested ? "&completed=1" : "";

  redirect(
    `/tageserfassung?date=${entryDate.inputValue}&saved=1${completionParameter}`,
  );
}
