"use client";

import { useState } from "react";

import { useRecipe } from "@/app/ernaehrung/actions";
import { planRecipe } from "@/app/ernaehrung/wochenplan/actions";
import { WeeklyPlanSubmit } from "@/components/nutrition/weekly-plan-submit";
import type { MealType } from "@/generated/prisma/enums";

export function RecipeDetailActions({
  initialDate,
  recipeId,
  type,
}: {
  initialDate: string;
  recipeId: string;
  type: MealType;
}) {
  const [date, setDate] = useState(initialDate);
  const canPlan = type !== "DRINK";

  return (
    <aside className="grid content-start gap-4 rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised p-4 lg:sticky lg:top-5">
      <div>
        <h2 className="font-semibold text-text-primary">Schnell verwenden</h2>
        <p className="mt-1 text-xs leading-5 text-text-muted">
          Tag auswählen und das Rezept einplanen oder direkt erfassen.
        </p>
      </div>
      <label htmlFor="recipe-date" className="text-sm font-semibold text-text-primary">Tag</label>
      <input
        id="recipe-date"
        type="date"
        value={date}
        onChange={(event) => setDate(event.target.value)}
        className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-3 text-base text-text-primary"
      />
      {canPlan ? (
        <form action={planRecipe}>
          <input type="hidden" name="plannedDate" value={date} />
          <input type="hidden" name="recipeId" value={recipeId} />
          <input type="hidden" name="type" value={type} />
          <WeeklyPlanSubmit pendingLabel="Wird eingeplant …" variant="primary" className="w-full">
            In den Wochenplan
          </WeeklyPlanSubmit>
        </form>
      ) : null}
      <form action={useRecipe}>
        <input type="hidden" name="entryDate" value={date} />
        <input type="hidden" name="recipeId" value={recipeId} />
        <WeeklyPlanSubmit pendingLabel="Wird erfasst …" variant="secondary" className="w-full">
          Jetzt erfassen
        </WeeklyPlanSubmit>
      </form>
      <p className="text-xs leading-5 text-text-muted">
        Nährwerte sind Näherungen pro gespeicherter Rezeptmenge.
      </p>
    </aside>
  );
}
