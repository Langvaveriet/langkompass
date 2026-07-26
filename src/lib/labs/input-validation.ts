import { z } from "zod";

import { labCorrectionReasons } from "@/lib/labs/correction-reasons";

function isIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) &&
    date.toISOString().slice(0, 10) === value
  );
}

function isTime(value: string): boolean {
  return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}

const optionalText = (maximum: number) =>
  z
    .string()
    .trim()
    .max(maximum)
    .transform((value) => value || null);

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

function hasValidReferenceRange({
    referenceLow,
    referenceHigh,
  }: {
    referenceLow: number | null;
    referenceHigh: number | null;
  }): boolean {
  return (
    referenceLow === null ||
    referenceHigh === null ||
    referenceLow <= referenceHigh
  );
}

export const labReportInputSchema = z.object({
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

export const labResultInputSchema = z
  .object({
    labReportId: z.string().uuid(),
    analyteKey: z.string().trim().min(1),
    value: decimalInput,
    referenceLow: optionalDecimalInput,
    referenceHigh: optionalDecimalInput,
    note: optionalText(500),
  })
  .refine(hasValidReferenceRange, { path: ["referenceHigh"] });

export const labCorrectionInputSchema = z
  .object({
    labResultId: z.string().uuid(),
    labReportId: z.string().uuid(),
    value: decimalInput,
    referenceLow: optionalDecimalInput,
    referenceHigh: optionalDecimalInput,
    note: optionalText(500),
    reason: z.enum(labCorrectionReasons),
  })
  .refine(hasValidReferenceRange, { path: ["referenceHigh"] });

export const labReportDeletionSchema = z.object({
  labReportId: z.string().uuid(),
  confirmDeletion: z.literal("DELETE"),
});
