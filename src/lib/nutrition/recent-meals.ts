type RecentMealItem = {
  foodKey: string | null;
  name: string;
  portion: string;
  quantity: unknown;
};

export type RecentMealCandidate = {
  id: string;
  type: string;
  items: RecentMealItem[];
};

function mealSignature(meal: RecentMealCandidate): string {
  const items = meal.items
    .map((item) =>
      [
        item.foodKey ?? item.name.trim().toLocaleLowerCase("de-DE"),
        item.portion,
        item.quantity === null || item.quantity === undefined
          ? ""
          : String(item.quantity),
      ].join(":"),
    )
    .sort();

  return `${meal.type}|${items.join("|")}`;
}

export function uniqueRecentMeals<T extends RecentMealCandidate>(
  meals: T[],
  limit = 5,
): T[] {
  const signatures = new Set<string>();
  const suggestions: T[] = [];

  for (const meal of meals) {
    if (meal.items.length === 0) continue;

    const signature = mealSignature(meal);
    if (signatures.has(signature)) continue;

    signatures.add(signature);
    suggestions.push(meal);

    if (suggestions.length >= limit) break;
  }

  return suggestions;
}
