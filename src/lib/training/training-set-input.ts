import { z } from "zod";

const optionalWeight = z
  .string()
  .trim()
  .transform((value) =>
    value === "" ? null : Number(value.replace(",", ".")),
  )
  .refine(
    (value) =>
      value === null ||
      (Number.isFinite(value) && value >= 0 && value <= 2000),
  );

const optionalEffort = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : Number(value)))
  .refine(
    (value) =>
      value === null ||
      (Number.isInteger(value) && value >= 1 && value <= 10),
  );

export const trainingSetInputSchema = z.object({
  trainingSessionId: z.string().trim().min(1),
  exerciseId: z.string().trim().min(1),
  repetitions: z.coerce.number().int().min(1).max(1000),
  weightKg: optionalWeight,
  effort: optionalEffort,
});
