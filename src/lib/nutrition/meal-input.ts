import { z } from "zod";

export const mealTypeValues = [
  "BREAKFAST",
  "LUNCH",
  "DINNER",
  "SNACK",
  "DRINK",
] as const;

const optionalQuantity = z
  .string()
  .trim()
  .transform((value) =>
    value === "" ? null : Number(value.replace(",", ".")),
  )
  .refine(
    (value) =>
      value === null ||
      (Number.isFinite(value) && value > 0 && value <= 5000),
  );

export const mealDetailsInputSchema = z.object({
  consumedTime: z.string().regex(/^(?:[01]\d|2[0-3]):[0-5]\d$/),
  type: z.enum(mealTypeValues),
  customQuantity: optionalQuantity,
});
