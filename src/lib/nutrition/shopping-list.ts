import type { FoodCategory, QuantityUnit } from "@/generated/prisma/enums";

export type ShoppingListSourceItem = {
  foodKey: string | null;
  name: string;
  category: FoodCategory;
  quantity: { toString(): string } | number | string | null;
  unit: QuantityUnit | null;
};

export type ShoppingListItem = {
  key: string;
  name: string;
  category: FoodCategory;
  quantity: number | null;
  unit: QuantityUnit | null;
  occurrences: number;
};

export const foodCategoryOrder: FoodCategory[] = [
  "VEGETABLE",
  "FRUIT",
  "MEAT",
  "FISH_SEAFOOD",
  "EGG",
  "DAIRY",
  "NUT_SEED",
  "LEGUME",
  "GRAIN",
  "FAT_OIL",
  "CONDIMENT",
  "BEVERAGE",
  "SWEET",
  "PREPARED_MEAL",
  "OTHER",
];

export const foodCategoryLabels: Record<FoodCategory, string> = {
  VEGETABLE: "Gemüse",
  FRUIT: "Obst",
  GRAIN: "Getreide & Beilagen",
  LEGUME: "Hülsenfrüchte",
  NUT_SEED: "Nüsse & Samen",
  DAIRY: "Milchprodukte",
  EGG: "Eier",
  MEAT: "Fleisch",
  FISH_SEAFOOD: "Fisch & Meeresfrüchte",
  FAT_OIL: "Öle & Fette",
  SWEET: "Süßes",
  BEVERAGE: "Getränke",
  CONDIMENT: "Gewürze & Würzmittel",
  PREPARED_MEAL: "Fertige Speisen",
  OTHER: "Sonstiges",
};

const unitLabels: Record<QuantityUnit, string> = {
  GRAM: "g",
  MILLILITER: "ml",
  PIECE: "Stk.",
  PORTION: "Port.",
  TABLESPOON: "EL",
  TEASPOON: "TL",
  CUP: "Tasse",
};

function normalizedItemName(name: string): string {
  return name
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("de-DE")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function itemKey(item: ShoppingListSourceItem): string {
  const identity = item.foodKey
    ? `food-${item.foodKey}`
    : `name-${normalizedItemName(item.name)}`;
  return `${identity}-${item.unit ?? "without-unit"}`;
}

function numericQuantity(
  quantity: ShoppingListSourceItem["quantity"],
): number | null {
  if (quantity === null) return null;
  const parsed = Number(
    typeof quantity === "object" ? quantity.toString() : quantity,
  );
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function buildShoppingList(
  items: readonly ShoppingListSourceItem[],
): ShoppingListItem[] {
  const aggregated = new Map<string, ShoppingListItem>();

  for (const item of items) {
    const key = itemKey(item);
    const quantity = numericQuantity(item.quantity);
    const existing = aggregated.get(key);
    if (!existing) {
      aggregated.set(key, {
        key,
        name: item.name.trim(),
        category: item.category,
        quantity,
        unit: item.unit,
        occurrences: 1,
      });
      continue;
    }

    existing.occurrences += 1;
    if (quantity !== null) {
      existing.quantity = (existing.quantity ?? 0) + quantity;
    }
  }

  return [...aggregated.values()].sort((left, right) => {
    const categoryDifference =
      foodCategoryOrder.indexOf(left.category) -
      foodCategoryOrder.indexOf(right.category);
    return categoryDifference || left.name.localeCompare(right.name, "de");
  });
}

export function formatShoppingQuantity(
  quantity: number | null,
  unit: QuantityUnit | null,
  locale = "de-DE",
): string {
  if (quantity === null || unit === null) return "nach Bedarf";
  const formatted = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  }).format(quantity);
  return `${formatted} ${unitLabels[unit]}`;
}

export function shoppingListTransferText(
  items: readonly ShoppingListItem[],
  locale = "de-DE",
): string {
  return items
    .map(
      (item) =>
        `${formatShoppingQuantity(item.quantity, item.unit, locale)} ${item.name}`,
    )
    .join("\n");
}
