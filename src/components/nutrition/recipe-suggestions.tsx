"use client";

import { useFormStatus } from "react-dom";

import {
  archiveRecipe,
  saveMealAsRecipe,
  useRecipe,
} from "@/app/ernaehrung/actions";
import { Button } from "@/components/ui/button";

export type RecipeSuggestion = {
  id: string;
  name: string;
  mealLabel: string;
  energyKcal: number | null;
  items: string[];
};

function SubmitButton({
  children,
  pendingLabel,
  variant = "secondary",
}: {
  children: string;
  pendingLabel: string;
  variant?: "primary" | "secondary" | "ghost";
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant={variant}
      size="md"
      disabled={pending}
      className="w-full"
    >
      {pending ? pendingLabel : children}
    </Button>
  );
}

export function SaveRecipeForm({
  entryDate,
  mealId,
  suggestedName,
}: {
  entryDate: string;
  mealId: string;
  suggestedName: string;
}) {
  return (
    <details className="mt-3 border-t border-border-subtle pt-3">
      <summary className="flex min-h-11 cursor-pointer list-none items-center text-xs font-semibold text-forest-strong">
        Als Vorlage speichern
      </summary>
      <form action={saveMealAsRecipe} className="mt-2 grid gap-2">
        <input type="hidden" name="entryDate" value={entryDate} />
        <input type="hidden" name="mealId" value={mealId} />
        <label
          htmlFor={`recipe-name-${mealId}`}
          className="text-xs font-semibold text-text-primary"
        >
          Name der Vorlage
        </label>
        <input
          id={`recipe-name-${mealId}`}
          name="recipeName"
          type="text"
          required
          minLength={2}
          maxLength={60}
          defaultValue={suggestedName}
          className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-3 text-base text-text-primary"
        />
        <SubmitButton pendingLabel="Wird gespeichert …">
          Vorlage speichern
        </SubmitButton>
      </form>
    </details>
  );
}

export function RecipeSuggestions({
  entryDate,
  recipes,
}: {
  entryDate: string;
  recipes: RecipeSuggestion[];
}) {
  if (recipes.length === 0) return null;

  return (
    <section
      className="mt-8 w-full min-w-0 max-w-4xl overflow-hidden"
      aria-labelledby="recipes-heading"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id="recipes-heading"
            className="text-lg font-semibold text-text-primary"
          >
            Meine Vorlagen
          </h2>
          <p className="mt-1 text-sm leading-6 text-text-muted">
            Gespeicherte Mahlzeiten mit einem Fingertipp erfassen.
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-text-muted">
          Wischen →
        </span>
      </div>

      <div className="mt-4 flex w-[calc(100vw-2rem)] max-w-full snap-x gap-3 overflow-x-auto pb-2">
        {recipes.map((recipe) => (
          <article
            key={recipe.id}
            className="flex w-[82vw] max-w-80 shrink-0 snap-start flex-col rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-text-primary">
                  {recipe.name}
                </h3>
                <p className="mt-1 text-xs text-text-muted">
                  {recipe.mealLabel}
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-forest-soft px-2.5 py-1 text-xs font-semibold text-forest-strong">
                {recipe.energyKcal === null
                  ? "ohne Schätzung"
                  : `ca. ${recipe.energyKcal} kcal`}
              </span>
            </div>

            <ul className="my-4 grid gap-1 text-sm leading-5 text-text-primary">
              {recipe.items.slice(0, 4).map((item, index) => (
                <li key={`${recipe.id}-${index}`}>{item}</li>
              ))}
              {recipe.items.length > 4 ? (
                <li className="text-text-muted">
                  + {recipe.items.length - 4} weitere
                </li>
              ) : null}
            </ul>

            <form action={useRecipe} className="mt-auto">
              <input type="hidden" name="entryDate" value={entryDate} />
              <input type="hidden" name="recipeId" value={recipe.id} />
              <SubmitButton pendingLabel="Wird übernommen …" variant="primary">
                Jetzt erfassen
              </SubmitButton>
            </form>

            <form action={archiveRecipe} className="mt-1">
              <input type="hidden" name="entryDate" value={entryDate} />
              <input type="hidden" name="recipeId" value={recipe.id} />
              <SubmitButton pendingLabel="Wird entfernt …" variant="ghost">
                Vorlage entfernen
              </SubmitButton>
            </form>
          </article>
        ))}
      </div>
    </section>
  );
}
