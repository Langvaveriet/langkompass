"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  isTime,
  parseIsoDate,
  parseOptionalDecimal,
  parseOptionalInteger,
  parseOptionalScale,
  type InputValidation,
} from "@/lib/daily-entry/input-validation";
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

function validatedValue<T>(
  validation: InputValidation<T>,
  field: string,
): T | null {
  if (!validation.success) {
    redirect(`/tageserfassung?error=${field}`);
  }

  return validation.value;
}

function getBoundedInteger(
  formData: FormData,
  field: string,
  minimum: number,
  maximum: number,
): number | null {
  return validatedValue(
    parseOptionalInteger(getText(formData, field), minimum, maximum),
    field,
  );
}

function getBoundedDecimal(
  formData: FormData,
  field: string,
  minimum: number,
  maximum: number,
): string | null {
  return validatedValue(
    parseOptionalDecimal(getText(formData, field), minimum, maximum),
    field,
  );
}

function getDate(formData: FormData): {
  inputValue: string;
  databaseValue: Date;
} {
  const value = getText(formData, "entryDate");

  const parsedDate = parseIsoDate(value);

  if (!parsedDate.success || parsedDate.value === null) {
    redirect("/tageserfassung?error=date");
  }

  return {
    inputValue: parsedDate.value.toISOString().slice(0, 10),
    databaseValue: parsedDate.value,
  };
}

function validateScale(
  value: string | null,
  field: string,
  minimum = 1,
): number | null {
  return validatedValue(parseOptionalScale(value, minimum), field);
}

function getWeight(formData: FormData): string | null {
  return getBoundedDecimal(formData, "weightKg", 20, 400);
}

function getWaist(formData: FormData): string | null {
  return getBoundedDecimal(formData, "waistCm", 30, 300);
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
    getText(formData, "wellbeing"),
    "wellbeing",
  );

  const mood = validateScale(
    getText(formData, "mood"),
    "mood",
  );

  const energy = validateScale(
    getText(formData, "energy"),
    "energy",
  );

  const sleepQuality = validateScale(
    getText(formData, "sleepQuality"),
    "sleepQuality",
  );

  const hungerLevel = validateScale(
    getText(formData, "hungerLevel"),
    "hungerLevel",
    0,
  );

  const painLevel = validateScale(
    getText(formData, "painLevel"),
    "painLevel",
    0,
  );

  const stressLevel = validateScale(
    getText(formData, "stressLevel"),
    "stressLevel",
    0,
  );

  const sleepHours = getBoundedDecimal(formData, "sleepHours", 0, 24);
  const weightKg = getWeight(formData);
  const weightMeasuredTime = getText(formData, "weightMeasuredTime");
  const waistCm = getWaist(formData);
  const waistMeasuredTime = getText(formData, "waistMeasuredTime");
  const waterLiters = getBoundedDecimal(formData, "waterLiters", 0, 20);
  const steps = getBoundedInteger(formData, "steps", 0, 250000);
  const distanceKm = getBoundedDecimal(formData, "distanceKm", 0, 1000);
  const activeMinutes = getBoundedInteger(
    formData,
    "activeMinutes",
    0,
    1440,
  );

  if (weightKg !== null && !isTime(weightMeasuredTime)) {
    redirect("/tageserfassung?error=weightMeasuredTime");
  }

  if (waistCm !== null && !isTime(waistMeasuredTime)) {
    redirect("/tageserfassung?error=waistMeasuredTime");
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
        mood,
        energy,
        sleepHours,
        sleepQuality,
        hungerLevel,
        painLevel,
        stressLevel,
        waterLiters,
        steps,
        distanceKm,
        activeMinutes,
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
        mood,
        energy,
        sleepHours,
        sleepQuality,
        hungerLevel,
        painLevel,
        stressLevel,
        waterLiters,
        steps,
        distanceKm,
        activeMinutes,
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

    if (waistCm !== null && waistMeasuredTime !== null) {
      const measuredAt = localDateTimeToUtc(
        entryDate.inputValue,
        waistMeasuredTime,
        timeZone,
      );

      await transaction.bodyMeasurement.upsert({
        where: {
          dailyEntryId_type: {
            dailyEntryId: dailyEntry.id,
            type: "WAIST_CIRCUMFERENCE",
          },
        },
        update: {
          value: waistCm,
          measuredAt,
          unit: "CENTIMETER",
          source: "MANUAL",
        },
        create: {
          userId: user.id,
          dailyEntryId: dailyEntry.id,
          type: "WAIST_CIRCUMFERENCE",
          value: waistCm,
          unit: "CENTIMETER",
          measuredAt,
          source: "MANUAL",
        },
      });
    } else {
      await transaction.bodyMeasurement.deleteMany({
        where: {
          userId: user.id,
          dailyEntryId: dailyEntry.id,
          type: "WAIST_CIRCUMFERENCE",
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
