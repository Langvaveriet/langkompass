import { z } from "zod";

export function normalizeRecipeName(name: string): string {
  return name
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("de-DE")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

export const recipeNameSchema = z
  .string()
  .trim()
  .min(2)
  .max(60)
  .refine((name) => normalizeRecipeName(name).length > 0);

export function suggestRecipeName(
  itemNames: string[],
  fallback: string,
): string {
  const uniqueNames = [...new Set(itemNames.map((name) => name.trim()))].filter(
    Boolean,
  );
  const suggestion = uniqueNames.slice(0, 3).join(", ") || fallback;

  return suggestion.length <= 60
    ? suggestion
    : `${suggestion.slice(0, 59).trimEnd()}…`;
}
