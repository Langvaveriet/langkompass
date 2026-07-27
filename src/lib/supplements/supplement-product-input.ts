import { z } from "zod";

import {
  supplementDoseUnits,
  supplementForms,
  supplementIngredientUnits,
  supplementReasons,
} from "@/lib/supplements/supplement-options";

const decimalInput = z
  .string()
  .trim()
  .transform((value) => Number(value.replace(",", ".")))
  .refine((value) => Number.isFinite(value) && value > 0 && value <= 100_000);

const optionalDecimalInput = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : Number(value.replace(",", "."))))
  .refine(
    (value) =>
      value === null ||
      (Number.isFinite(value) && value > 0 && value <= 100_000),
  );

export const supplementProductInputSchema = z.object({
  name: z.string().trim().min(2).max(100),
  brand: z
    .string()
    .trim()
    .max(100)
    .transform((value) => value || null),
  form: z.enum(supplementForms),
  defaultDose: decimalInput,
  doseUnit: z.enum(supplementDoseUnits),
  reason: z.enum(supplementReasons),
  notes: z
    .string()
    .trim()
    .max(500)
    .transform((value) => value || null),
});

export const supplementIngredientInputSchema = z.object({
  ingredientName: z.string().trim().min(2).max(100),
  ingredientAmount: optionalDecimalInput,
  elementalAmount: optionalDecimalInput,
  ingredientUnit: z.enum(supplementIngredientUnits),
});

export const supplementCreationIngredientsSchema = z
  .array(supplementIngredientInputSchema)
  .min(1)
  .max(20)
  .superRefine((ingredients, context) => {
    const names = new Set<string>();

    ingredients.forEach((ingredient, index) => {
      const normalizedName = ingredient.ingredientName.toLocaleLowerCase("de-DE");

      if (names.has(normalizedName)) {
        context.addIssue({
          code: "custom",
          message: "Wirkstoffnamen müssen eindeutig sein.",
          path: [index, "ingredientName"],
        });
      }

      names.add(normalizedName);
    });
  });
