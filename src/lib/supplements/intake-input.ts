import { z } from "zod";

import { supplementIntakeCorrectionReasons } from "@/lib/supplements/intake-corrections";
import {
  supplementDoseUnits,
  supplementEffects,
  supplementTolerances,
} from "@/lib/supplements/supplement-options";

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

const doseInput = z
  .string()
  .trim()
  .transform((value) => Number(value.replace(",", ".")))
  .refine(
    (value) => Number.isFinite(value) && value > 0 && value <= 100_000,
  );

const observationFields = {
  tolerance: z.enum(supplementTolerances),
  effect: z.enum(supplementEffects),
  note: z
    .string()
    .trim()
    .max(500)
    .transform((value) => value || null),
} as const;

export const supplementIntakeInputSchema = z.object({
  supplementId: z.string().trim().min(1),
  takenDate: z.string().refine(isIsoDate),
  takenTime: z.string().refine(isTime),
  dose: doseInput,
  ...observationFields,
});

export const supplementIntakeCorrectionInputSchema = z.object({
  intakeId: z.string().trim().min(1),
  takenDate: z.string().refine(isIsoDate),
  takenTime: z.string().refine(isTime),
  dose: doseInput,
  doseUnit: z.enum(supplementDoseUnits),
  ...observationFields,
  reason: z.enum(supplementIntakeCorrectionReasons),
});

export const supplementIntakeDeletionSchema = z.object({
  intakeId: z.string().trim().min(1),
  confirmDeletion: z.literal("DELETE"),
});
