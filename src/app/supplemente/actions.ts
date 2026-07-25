"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  supplementDoseUnits,
  supplementEffects,
  supplementForms,
  supplementIngredientUnits,
  supplementReasons,
  supplementTolerances,
} from "@/lib/supplements/supplement-options";
import {
  defaultTimeZone,
  localDateTimeToUtc,
} from "@/lib/user-settings";

const decimalInput = z
  .string()
  .trim()
  .transform((value) => Number(value.replace(",", ".")))
  .refine((value) => Number.isFinite(value) && value > 0 && value <= 100_000);

const optionalDecimalInput = z
  .string()
  .trim()
  .transform((value) => value === "" ? null : Number(value.replace(",", ".")))
  .refine((value) => value === null || (Number.isFinite(value) && value > 0 && value <= 100_000));

const supplementSchema = z.object({
  name: z.string().trim().min(2).max(100),
  brand: z.string().trim().max(100).transform((value) => value || null),
  form: z.enum(supplementForms),
  defaultDose: decimalInput,
  doseUnit: z.enum(supplementDoseUnits),
  reason: z.enum(supplementReasons),
  ingredientName: z.string().trim().min(2).max(100),
  ingredientAmount: optionalDecimalInput,
  elementalAmount: optionalDecimalInput,
  ingredientUnit: z.enum(supplementIngredientUnits),
  notes: z.string().trim().max(500).transform((value) => value || null),
});

const supplementIdSchema = z.object({
  supplementId: z.string().trim().min(1),
});

const intakeSchema = supplementIdSchema.extend({
  takenDate: z.string().refine(isIsoDate),
  takenTime: z.string().refine(isTime),
  dose: decimalInput,
  tolerance: z.enum(supplementTolerances),
  effect: z.enum(supplementEffects),
  note: z.string().trim().max(500).transform((value) => value || null),
});

function formText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value : "";
}

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isTime(value: string): boolean {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  return Boolean(match && Number(match[1]) <= 23 && Number(match[2]) <= 59);
}

export async function createSupplement(formData: FormData) {
  const user = await requireUser();
  const parsed = supplementSchema.safeParse({
    name: formText(formData, "name"),
    brand: formText(formData, "brand"),
    form: formText(formData, "form"),
    defaultDose: formText(formData, "defaultDose"),
    doseUnit: formText(formData, "doseUnit"),
    reason: formText(formData, "reason"),
    ingredientName: formText(formData, "ingredientName"),
    ingredientAmount: formText(formData, "ingredientAmount"),
    elementalAmount: formText(formData, "elementalAmount"),
    ingredientUnit: formText(formData, "ingredientUnit"),
    notes: formText(formData, "notes"),
  });

  if (!parsed.success) redirect("/supplemente?error=validation");

  const duplicate = await prisma.supplement.findFirst({
    where: {
      userId: user.id,
      name: { equals: parsed.data.name, mode: "insensitive" },
      archivedAt: null,
    },
    select: { id: true },
  });
  if (duplicate) redirect("/supplemente?error=duplicate");

  const supplement = await prisma.supplement.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      brand: parsed.data.brand,
      form: parsed.data.form,
      defaultDose: parsed.data.defaultDose,
      doseUnit: parsed.data.doseUnit,
      reason: parsed.data.reason,
      notes: parsed.data.notes,
      ingredients: {
        create: {
          userId: user.id,
          name: parsed.data.ingredientName,
          amount: parsed.data.ingredientAmount,
          elementalAmount: parsed.data.elementalAmount,
          unit: parsed.data.ingredientUnit,
        },
      },
    },
  });

  revalidatePath("/");
  revalidatePath("/supplemente");
  redirect(`/supplemente?created=1&supplement=${encodeURIComponent(supplement.id)}`);
}

export async function logSupplementNow(formData: FormData) {
  const user = await requireUser();
  const parsed = supplementIdSchema.safeParse({
    supplementId: formText(formData, "supplementId"),
  });
  if (!parsed.success) redirect("/supplemente?error=intake-validation");

  const supplement = await prisma.supplement.findFirst({
    where: { id: parsed.data.supplementId, userId: user.id, archivedAt: null },
    select: { id: true, defaultDose: true, doseUnit: true },
  });
  if (!supplement) redirect("/supplemente?error=not-found");

  await prisma.supplementIntake.create({
    data: {
      userId: user.id,
      supplementId: supplement.id,
      takenAt: new Date(),
      dose: supplement.defaultDose,
      doseUnit: supplement.doseUnit,
    },
  });

  revalidatePath("/");
  revalidatePath("/supplemente");
  redirect(`/supplemente?taken=1&supplement=${encodeURIComponent(supplement.id)}`);
}

export async function logSupplementIntake(formData: FormData) {
  const user = await requireUser();
  const parsed = intakeSchema.safeParse({
    supplementId: formText(formData, "supplementId"),
    takenDate: formText(formData, "takenDate"),
    takenTime: formText(formData, "takenTime"),
    dose: formText(formData, "dose"),
    tolerance: formText(formData, "tolerance"),
    effect: formText(formData, "effect"),
    note: formText(formData, "note"),
  });
  if (!parsed.success) redirect("/supplemente?error=intake-validation");

  const [supplement, settings] = await Promise.all([
    prisma.supplement.findFirst({
      where: { id: parsed.data.supplementId, userId: user.id, archivedAt: null },
      select: { id: true, doseUnit: true },
    }),
    prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: { timeZone: true },
    }),
  ]);
  if (!supplement) redirect("/supplemente?error=not-found");

  await prisma.supplementIntake.create({
    data: {
      userId: user.id,
      supplementId: supplement.id,
      takenAt: localDateTimeToUtc(
        parsed.data.takenDate,
        parsed.data.takenTime,
        settings?.timeZone ?? defaultTimeZone,
      ),
      dose: parsed.data.dose,
      doseUnit: supplement.doseUnit,
      tolerance: parsed.data.tolerance,
      effect: parsed.data.effect,
      note: parsed.data.note,
    },
  });

  revalidatePath("/");
  revalidatePath("/supplemente");
  redirect(`/supplemente?taken=1&supplement=${encodeURIComponent(supplement.id)}`);
}
