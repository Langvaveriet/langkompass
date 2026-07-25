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

const supplementProductSchema = z.object({
  name: z.string().trim().min(2).max(100),
  brand: z.string().trim().max(100).transform((value) => value || null),
  form: z.enum(supplementForms),
  defaultDose: decimalInput,
  doseUnit: z.enum(supplementDoseUnits),
  reason: z.enum(supplementReasons),
  notes: z.string().trim().max(500).transform((value) => value || null),
});

const ingredientFields = {
  ingredientName: z.string().trim().min(2).max(100),
  ingredientAmount: optionalDecimalInput,
  elementalAmount: optionalDecimalInput,
  ingredientUnit: z.enum(supplementIngredientUnits),
} as const;

const supplementSchema = supplementProductSchema.extend(ingredientFields);

const supplementUpdateSchema = supplementProductSchema.extend({
  supplementId: z.string().trim().min(1),
});

const ingredientSchema = z.object({
  supplementId: z.string().trim().min(1),
  ingredientId: z.string().trim().min(1).optional(),
  ...ingredientFields,
});

const ingredientDeleteSchema = z.object({
  supplementId: z.string().trim().min(1),
  ingredientId: z.string().trim().min(1),
  confirmDeletion: z.literal("DELETE"),
});

const supplementArchiveSchema = z.object({
  supplementId: z.string().trim().min(1),
  intent: z.enum(["archive", "restore"]),
  confirmation: z.string(),
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
    },
    select: { id: true, archivedAt: true },
  });
  if (duplicate) {
    redirect(`/supplemente?error=${duplicate.archivedAt ? "archived-exists" : "duplicate"}`);
  }

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

export async function updateSupplement(formData: FormData) {
  const user = await requireUser();
  const parsed = supplementUpdateSchema.safeParse({
    supplementId: formText(formData, "supplementId"),
    name: formText(formData, "name"),
    brand: formText(formData, "brand"),
    form: formText(formData, "form"),
    defaultDose: formText(formData, "defaultDose"),
    doseUnit: formText(formData, "doseUnit"),
    reason: formText(formData, "reason"),
    notes: formText(formData, "notes"),
  });
  if (!parsed.success) redirect("/supplemente?error=product-validation");

  const [supplement, duplicate] = await Promise.all([
    prisma.supplement.findFirst({
      where: { id: parsed.data.supplementId, userId: user.id, archivedAt: null },
      select: { id: true },
    }),
    prisma.supplement.findFirst({
      where: {
        userId: user.id,
        id: { not: parsed.data.supplementId },
        name: { equals: parsed.data.name, mode: "insensitive" },
      },
      select: { id: true, archivedAt: true },
    }),
  ]);
  if (!supplement) redirect("/supplemente?error=not-found");
  if (duplicate) {
    redirect(`/supplemente?error=${duplicate.archivedAt ? "archived-exists" : "duplicate"}`);
  }

  await prisma.supplement.update({
    where: { id: supplement.id },
    data: {
      name: parsed.data.name,
      brand: parsed.data.brand,
      form: parsed.data.form,
      defaultDose: parsed.data.defaultDose,
      doseUnit: parsed.data.doseUnit,
      reason: parsed.data.reason,
      notes: parsed.data.notes,
    },
  });

  revalidatePath("/");
  revalidatePath("/supplemente");
  redirect(`/supplemente?updated=1&supplement=${encodeURIComponent(supplement.id)}`);
}

export async function saveSupplementIngredient(formData: FormData) {
  const user = await requireUser();
  const ingredientId = formText(formData, "ingredientId") || undefined;
  const parsed = ingredientSchema.safeParse({
    supplementId: formText(formData, "supplementId"),
    ingredientId,
    ingredientName: formText(formData, "ingredientName"),
    ingredientAmount: formText(formData, "ingredientAmount"),
    elementalAmount: formText(formData, "elementalAmount"),
    ingredientUnit: formText(formData, "ingredientUnit"),
  });
  if (!parsed.success) redirect("/supplemente?error=ingredient-validation");

  const supplement = await prisma.supplement.findFirst({
    where: { id: parsed.data.supplementId, userId: user.id, archivedAt: null },
    select: { id: true },
  });
  if (!supplement) redirect("/supplemente?error=not-found");

  const duplicate = await prisma.supplementIngredient.findFirst({
    where: {
      supplementId: supplement.id,
      id: parsed.data.ingredientId ? { not: parsed.data.ingredientId } : undefined,
      name: { equals: parsed.data.ingredientName, mode: "insensitive" },
    },
    select: { id: true },
  });
  if (duplicate) redirect("/supplemente?error=ingredient-duplicate");

  const data = {
    name: parsed.data.ingredientName,
    amount: parsed.data.ingredientAmount,
    elementalAmount: parsed.data.elementalAmount,
    unit: parsed.data.ingredientUnit,
  };
  if (parsed.data.ingredientId) {
    const ingredient = await prisma.supplementIngredient.findFirst({
      where: {
        id: parsed.data.ingredientId,
        supplementId: supplement.id,
        userId: user.id,
      },
      select: { id: true },
    });
    if (!ingredient) redirect("/supplemente?error=ingredient-not-found");
    await prisma.supplementIngredient.update({ where: { id: ingredient.id }, data });
  } else {
    await prisma.supplementIngredient.create({
      data: { userId: user.id, supplementId: supplement.id, ...data },
    });
  }

  revalidatePath("/supplemente");
  redirect(`/supplemente?ingredientSaved=1&supplement=${encodeURIComponent(supplement.id)}`);
}

export async function deleteSupplementIngredient(formData: FormData) {
  const user = await requireUser();
  const parsed = ingredientDeleteSchema.safeParse({
    supplementId: formText(formData, "supplementId"),
    ingredientId: formText(formData, "ingredientId"),
    confirmDeletion: formText(formData, "confirmDeletion"),
  });
  if (!parsed.success) redirect("/supplemente?error=ingredient-delete-validation");

  const [ingredient, ingredientCount] = await Promise.all([
    prisma.supplementIngredient.findFirst({
      where: {
        id: parsed.data.ingredientId,
        supplementId: parsed.data.supplementId,
        userId: user.id,
        supplement: { userId: user.id, archivedAt: null },
      },
      select: { id: true },
    }),
    prisma.supplementIngredient.count({
      where: { supplementId: parsed.data.supplementId, userId: user.id },
    }),
  ]);
  if (!ingredient) redirect("/supplemente?error=ingredient-not-found");
  if (ingredientCount <= 1) redirect("/supplemente?error=last-ingredient");

  await prisma.supplementIngredient.delete({ where: { id: ingredient.id } });
  revalidatePath("/supplemente");
  redirect(`/supplemente?ingredientDeleted=1&supplement=${encodeURIComponent(parsed.data.supplementId)}`);
}

export async function setSupplementArchived(formData: FormData) {
  const user = await requireUser();
  const parsed = supplementArchiveSchema.safeParse({
    supplementId: formText(formData, "supplementId"),
    intent: formText(formData, "intent"),
    confirmation: formText(formData, "confirmation"),
  });
  if (!parsed.success || (parsed.data.intent === "archive" && parsed.data.confirmation !== "ARCHIVE")) {
    redirect("/supplemente?error=archive-validation");
  }

  const supplement = await prisma.supplement.findFirst({
    where: { id: parsed.data.supplementId, userId: user.id },
    select: { id: true, name: true },
  });
  if (!supplement) redirect("/supplemente?error=not-found");

  const restoring = parsed.data.intent === "restore";
  if (restoring) {
    const duplicate = await prisma.supplement.findFirst({
      where: {
        userId: user.id,
        id: { not: supplement.id },
        name: { equals: supplement.name, mode: "insensitive" },
        archivedAt: null,
      },
      select: { id: true },
    });
    if (duplicate) redirect("/supplemente?error=duplicate");
  }

  await prisma.supplement.update({
    where: { id: supplement.id },
    data: { archivedAt: restoring ? null : new Date() },
  });
  revalidatePath("/");
  revalidatePath("/supplemente");
  redirect(`/supplemente?${restoring ? "restored" : "archived"}=1`);
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
