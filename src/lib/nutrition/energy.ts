import { foodCatalogByKey } from "@/lib/nutrition/food-catalog";

type EnergyItem = {
  energyKcal: unknown;
  foodKey: string | null;
  quantity: unknown;
};

export function estimatedFoodEnergy(item: EnergyItem): number | null {
  if (item.energyKcal !== null && item.energyKcal !== undefined) {
    return Number(item.energyKcal);
  }

  const food = item.foodKey ? foodCatalogByKey.get(item.foodKey) : null;
  if (!food || item.quantity === null || item.quantity === undefined) {
    return null;
  }

  return Math.round((food.kcalPer100 * Number(item.quantity)) / 100);
}
