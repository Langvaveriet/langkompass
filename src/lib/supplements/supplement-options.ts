import type {
  SupplementDoseUnit,
  SupplementEffect,
  SupplementForm,
  SupplementIngredientUnit,
  SupplementReason,
  SupplementTolerance,
} from "@/generated/prisma/enums";

export const supplementForms = [
  "CAPSULE",
  "TABLET",
  "POWDER",
  "LIQUID",
  "DROPS",
  "SPRAY",
  "OTHER",
] as const satisfies readonly SupplementForm[];

export const supplementFormLabels: Record<SupplementForm, string> = {
  CAPSULE: "Kapsel",
  TABLET: "Tablette",
  POWDER: "Pulver",
  LIQUID: "Flüssig",
  DROPS: "Tropfen",
  SPRAY: "Spray",
  OTHER: "Andere Form",
};

export const supplementDoseUnits = [
  "CAPSULE",
  "TABLET",
  "GRAM",
  "MILLIGRAM",
  "MILLILITER",
  "DROP",
  "SCOOP",
  "SPRAY",
] as const satisfies readonly SupplementDoseUnit[];

export const supplementDoseUnitLabels: Record<SupplementDoseUnit, string> = {
  CAPSULE: "Kapseln",
  TABLET: "Tabletten",
  GRAM: "g",
  MILLIGRAM: "mg",
  MILLILITER: "ml",
  DROP: "Tropfen",
  SCOOP: "Messlöffel",
  SPRAY: "Sprühstöße",
};

const supplementDoseUnitSingularLabels: Record<SupplementDoseUnit, string> = {
  ...supplementDoseUnitLabels,
  CAPSULE: "Kapsel",
  TABLET: "Tablette",
  SPRAY: "Sprühstoß",
};

export function supplementDoseUnitLabel(
  unit: SupplementDoseUnit,
  dose: number,
): string {
  return dose === 1
    ? supplementDoseUnitSingularLabels[unit]
    : supplementDoseUnitLabels[unit];
}

export const supplementIngredientUnits = [
  "MILLIGRAM",
  "MICROGRAM",
  "GRAM",
  "INTERNATIONAL_UNIT",
] as const satisfies readonly SupplementIngredientUnit[];

export const supplementIngredientUnitLabels: Record<SupplementIngredientUnit, string> = {
  GRAM: "g",
  MILLIGRAM: "mg",
  MICROGRAM: "µg",
  INTERNATIONAL_UNIT: "I.E.",
};

export const supplementReasons = [
  "GENERAL_WELLBEING",
  "DEFICIENCY",
  "LAB_SUPPORT",
  "IMMUNE_SUPPORT",
  "DIGESTION",
  "SLEEP",
  "ENERGY",
  "TRAINING",
  "OTHER",
] as const satisfies readonly SupplementReason[];

export const supplementReasonLabels: Record<SupplementReason, string> = {
  GENERAL_WELLBEING: "Allgemeines Wohlbefinden",
  DEFICIENCY: "Festgestellter Mangel",
  LAB_SUPPORT: "Begleitung von Laborwerten",
  IMMUNE_SUPPORT: "Immunsystem",
  DIGESTION: "Verdauung",
  SLEEP: "Schlaf",
  ENERGY: "Energie",
  TRAINING: "Training",
  OTHER: "Anderer Grund",
};

export const supplementTolerances = [
  "NOT_RATED",
  "WELL_TOLERATED",
  "NEUTRAL",
  "POSSIBLE_REACTION",
] as const satisfies readonly SupplementTolerance[];

export const supplementToleranceLabels: Record<SupplementTolerance, string> = {
  NOT_RATED: "Nicht bewertet",
  WELL_TOLERATED: "Gut vertragen",
  NEUTRAL: "Unauffällig",
  POSSIBLE_REACTION: "Mögliche Reaktion",
};

export const supplementEffects = [
  "NOT_RATED",
  "POSITIVE",
  "NEUTRAL",
  "NEGATIVE",
  "UNCLEAR",
] as const satisfies readonly SupplementEffect[];

export const supplementEffectLabels: Record<SupplementEffect, string> = {
  NOT_RATED: "Nicht bewertet",
  POSITIVE: "Positiv bemerkt",
  NEUTRAL: "Keine Veränderung",
  NEGATIVE: "Negativ bemerkt",
  UNCLEAR: "Noch unklar",
};
