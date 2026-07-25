import type { MealType } from "@/generated/prisma/enums";

type PlannableMealType = Exclude<MealType, "DRINK">;

export type AutomaticPlanRecipe = {
  key: string;
  type: PlannableMealType;
  favorite: boolean;
};

export type AutomaticPlanAssignment = {
  date: string;
  type: PlannableMealType;
  recipeKey: string;
};

function stableHash(value: string): number {
  let hash = 0;
  for (const character of value) {
    hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  }
  return hash;
}

function rotate<T>(values: T[], offset: number): T[] {
  if (values.length < 2) return values;
  const start = offset % values.length;
  return [...values.slice(start), ...values.slice(0, start)];
}

export function buildAutomaticWeekPlan(
  dates: string[],
  types: PlannableMealType[],
  recipes: AutomaticPlanRecipe[],
): AutomaticPlanAssignment[] {
  const assignments: AutomaticPlanAssignment[] = [];

  for (const type of types) {
    const candidates = recipes.filter((recipe) => recipe.type === type);
    const favorites = rotate(
      candidates.filter((recipe) => recipe.favorite),
      stableHash(`${dates[0]}-${type}-favorites`),
    );
    const remaining = rotate(
      candidates.filter((recipe) => !recipe.favorite),
      stableHash(`${dates[0]}-${type}-catalog`),
    );
    const ordered = [...favorites, ...remaining];
    if (ordered.length === 0) continue;

    dates.forEach((date, index) => {
      assignments.push({
        date,
        type,
        recipeKey: ordered[index % ordered.length].key,
      });
    });
  }

  return assignments;
}
