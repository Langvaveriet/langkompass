"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { labAnalyteByKey } from "@/lib/labs/lab-catalog";
import { labCorrectionReasons } from "@/lib/labs/correction-reasons";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  defaultTimeZone,
  localDateTimeToUtc,
} from "@/lib/user-settings";

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).transform((value) => value || null);

const reportSchema = z.object({
  collectedDate: z.string().refine(isIsoDate),
  collectedTime: z.string().refine(isTime),
  fastingStatus: z.enum(["UNKNOWN", "FASTING", "NOT_FASTING"]),
  laboratory: optionalText(120),
  physicianComment: optionalText(1000),
  controlDate: z
    .string()
    .trim()
    .refine((value) => value === "" || isIsoDate(value))
    .transform((value) => value || null),
  notes: optionalText(1000),
});

const decimalInput = z
  .string()
  .trim()
  .transform((value) => value.replace(",", "."))
  .refine((value) => value !== "" && Number.isFinite(Number(value)))
  .transform(Number)
  .refine((value) => value >= 0 && value <= 1_000_000);

const optionalDecimalInput = z
  .string()
  .trim()
  .transform((value) => value.replace(",", "."))
  .refine((value) => value === "" || Number.isFinite(Number(value)))
  .transform((value) => (value === "" ? null : Number(value)))
  .refine((value) => value === null || Math.abs(value) <= 1_000_000);

const resultSchema = z.object({
  labReportId: z.string().uuid(),
  analyteKey: z.string().trim().min(1),
  value: decimalInput,
  referenceLow: optionalDecimalInput,
  referenceHigh: optionalDecimalInput,
  note: optionalText(500),
}).refine(
  ({ referenceLow, referenceHigh }) =>
    referenceLow === null ||
    referenceHigh === null ||
    referenceLow <= referenceHigh,
  { path: ["referenceHigh"] },
);

const correctionSchema = z.object({
  labResultId: z.string().uuid(),
  labReportId: z.string().uuid(),
  value: decimalInput,
  referenceLow: optionalDecimalInput,
  referenceHigh: optionalDecimalInput,
  note: optionalText(500),
  reason: z.enum(labCorrectionReasons),
}).refine(
  ({ referenceLow, referenceHigh }) =>
    referenceLow === null ||
    referenceHigh === null ||
    referenceLow <= referenceHigh,
  { path: ["referenceHigh"] },
);

const deleteReportSchema = z.object({
  labReportId: z.string().uuid(),
  confirmDeletion: z.literal("DELETE"),
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
  if (!match) return false;
  return Number(match[1]) <= 23 && Number(match[2]) <= 59;
}

export async function createLabReport(formData: FormData) {
  const user = await requireUser();
  const parsed = reportSchema.safeParse({
    collectedDate: formText(formData, "collectedDate"),
    collectedTime: formText(formData, "collectedTime"),
    fastingStatus: formText(formData, "fastingStatus"),
    laboratory: formText(formData, "laboratory"),
    physicianComment: formText(formData, "physicianComment"),
    controlDate: formText(formData, "controlDate"),
    notes: formText(formData, "notes"),
  });

  if (!parsed.success) redirect("/laborwerte?error=report-validation");

  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
    select: { timeZone: true },
  });
  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const report = await prisma.labReport.create({
    data: {
      userId: user.id,
      collectedAt: localDateTimeToUtc(
        parsed.data.collectedDate,
        parsed.data.collectedTime,
        timeZone,
      ),
      fastingStatus: parsed.data.fastingStatus,
      laboratory: parsed.data.laboratory,
      physicianComment: parsed.data.physicianComment,
      controlDate: parsed.data.controlDate
        ? new Date(`${parsed.data.controlDate}T00:00:00.000Z`)
        : null,
      notes: parsed.data.notes,
    },
  });

  revalidatePath("/laborwerte");
  redirect(`/laborwerte?report=${report.id}&created=1`);
}

export async function addLabResult(formData: FormData) {
  const user = await requireUser();
  const submittedReportId = formText(formData, "labReportId");
  const parsed = resultSchema.safeParse({
    labReportId: submittedReportId,
    analyteKey: formText(formData, "analyteKey"),
    value: formText(formData, "value"),
    referenceLow: formText(formData, "referenceLow"),
    referenceHigh: formText(formData, "referenceHigh"),
    note: formText(formData, "note"),
  });

  if (!parsed.success) {
    const reportQuery = z.string().uuid().safeParse(submittedReportId).success
      ? `report=${submittedReportId}&`
      : "";
    redirect(`/laborwerte?${reportQuery}error=result-validation`);
  }
  const analyte = labAnalyteByKey.get(parsed.data.analyteKey);
  if (!analyte) redirect(`/laborwerte?report=${parsed.data.labReportId}&error=analyte`);

  const report = await prisma.labReport.findFirst({
    where: { id: parsed.data.labReportId, userId: user.id },
    select: { id: true, collectedAt: true },
  });
  if (!report) redirect("/laborwerte?error=report-not-found");

  const duplicate = await prisma.labResult.findUnique({
    where: {
      labReportId_analyteKey: {
        labReportId: report.id,
        analyteKey: analyte.key,
      },
    },
    select: { id: true },
  });
  if (duplicate) redirect(`/laborwerte?report=${report.id}&error=duplicate`);

  await prisma.labResult.create({
    data: {
      userId: user.id,
      labReportId: report.id,
      analyteKey: analyte.key,
      analyteName: analyte.name,
      value: parsed.data.value,
      unit: analyte.unit,
      referenceLow: parsed.data.referenceLow,
      referenceHigh: parsed.data.referenceHigh,
      measuredAt: report.collectedAt,
      note: parsed.data.note,
    },
  });

  revalidatePath("/laborwerte");
  redirect(`/laborwerte?report=${report.id}&saved=1`);
}

export async function correctLabResult(formData: FormData) {
  const user = await requireUser();
  const submittedReportId = formText(formData, "labReportId");
  const submittedResultId = formText(formData, "labResultId");
  const parsed = correctionSchema.safeParse({
    labResultId: submittedResultId,
    labReportId: submittedReportId,
    value: formText(formData, "value"),
    referenceLow: formText(formData, "referenceLow"),
    referenceHigh: formText(formData, "referenceHigh"),
    note: formText(formData, "note"),
    reason: formText(formData, "reason"),
  });

  if (!parsed.success) {
    const reportQuery = z.string().uuid().safeParse(submittedReportId).success
      ? `report=${submittedReportId}&`
      : "";
    const resultQuery = z.string().uuid().safeParse(submittedResultId).success
      ? `editResult=${submittedResultId}&`
      : "";
    redirect(`/laborwerte?${reportQuery}${resultQuery}error=correction-validation`);
  }

  const result = await prisma.labResult.findFirst({
    where: {
      id: parsed.data.labResultId,
      userId: user.id,
      labReportId: parsed.data.labReportId,
      labReport: { userId: user.id },
    },
    select: {
      id: true,
      analyteKey: true,
      value: true,
      referenceLow: true,
      referenceHigh: true,
      note: true,
    },
  });
  if (!result) {
    redirect(`/laborwerte?report=${parsed.data.labReportId}&error=result-not-found`);
  }

  await prisma.$transaction([
    prisma.labResultRevision.create({
      data: {
        userId: user.id,
        labResultId: result.id,
        previousValue: result.value,
        previousReferenceLow: result.referenceLow,
        previousReferenceHigh: result.referenceHigh,
        previousNote: result.note,
        reason: parsed.data.reason,
      },
    }),
    prisma.labResult.update({
      where: { id: result.id },
      data: {
        value: parsed.data.value,
        referenceLow: parsed.data.referenceLow,
        referenceHigh: parsed.data.referenceHigh,
        note: parsed.data.note,
      },
    }),
  ]);

  revalidatePath("/");
  revalidatePath("/laborwerte");
  redirect(`/laborwerte?report=${parsed.data.labReportId}&analyte=${encodeURIComponent(result.analyteKey)}&corrected=1`);
}

export async function deleteLabReport(formData: FormData) {
  const user = await requireUser();
  const submittedReportId = formText(formData, "labReportId");
  const parsed = deleteReportSchema.safeParse({
    labReportId: submittedReportId,
    confirmDeletion: formText(formData, "confirmDeletion"),
  });

  if (!parsed.success) {
    const reportQuery = z.string().uuid().safeParse(submittedReportId).success
      ? `report=${submittedReportId}&`
      : "";
    redirect(`/laborwerte?${reportQuery}error=delete-validation`);
  }

  const deleted = await prisma.labReport.deleteMany({
    where: { id: parsed.data.labReportId, userId: user.id },
  });
  if (deleted.count === 0) redirect("/laborwerte?error=report-not-found");

  revalidatePath("/");
  revalidatePath("/laborwerte");
  redirect("/laborwerte?deleted=1");
}
