"use client";

import { useFormStatus } from "react-dom";

import { repeatMeal } from "@/app/ernaehrung/actions";
import { Button } from "@/components/ui/button";

export type RecentMealSuggestion = {
  id: string;
  mealLabel: string;
  dateLabel: string;
  timeLabel: string;
  energyKcal: number | null;
  items: string[];
};

function RepeatButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      variant="secondary"
      size="sm"
      disabled={pending}
      className="w-full"
    >
      {pending ? "Wird übernommen …" : "Übernehmen"}
    </Button>
  );
}

export function RecentMealSuggestions({
  entryDate,
  suggestions,
}: {
  entryDate: string;
  suggestions: RecentMealSuggestion[];
}) {
  if (suggestions.length === 0) return null;

  return (
    <section
      className="mt-8 w-full min-w-0 max-w-4xl overflow-hidden"
      aria-labelledby="recent-meals-heading"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2
            id="recent-meals-heading"
            className="text-lg font-semibold text-text-primary"
          >
            Schnell wiederholen
          </h2>
          <p className="mt-1 text-sm leading-6 text-text-muted">
            Lebensmittel und Mengen aus einer früheren Mahlzeit übernehmen.
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-text-muted">
          Wischen →
        </span>
      </div>

      <div className="mt-4 flex w-[calc(100vw-2rem)] max-w-full snap-x gap-3 overflow-x-auto pb-2">
        {suggestions.map((suggestion) => (
          <article
            key={suggestion.id}
            className="flex w-[82vw] max-w-72 shrink-0 snap-start flex-col rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-semibold text-text-primary">
                  {suggestion.mealLabel}
                </h3>
                <p className="mt-1 text-xs text-text-muted">
                  {suggestion.dateLabel} · {suggestion.timeLabel} Uhr
                </p>
              </div>
              <span className="shrink-0 rounded-full bg-forest-soft px-2.5 py-1 text-xs font-semibold text-forest-strong">
                {suggestion.energyKcal === null
                  ? "ohne Schätzung"
                  : `ca. ${suggestion.energyKcal} kcal`}
              </span>
            </div>

            <ul className="my-4 grid gap-1 text-sm leading-5 text-text-primary">
              {suggestion.items.slice(0, 3).map((item, index) => (
                <li key={`${suggestion.id}-${index}`}>{item}</li>
              ))}
              {suggestion.items.length > 3 ? (
                <li className="text-text-muted">
                  + {suggestion.items.length - 3} weitere
                </li>
              ) : null}
            </ul>

            <form action={repeatMeal} className="mt-auto">
              <input type="hidden" name="entryDate" value={entryDate} />
              <input
                type="hidden"
                name="sourceMealId"
                value={suggestion.id}
              />
              <RepeatButton />
            </form>
          </article>
        ))}
      </div>
      <p className="mt-1 text-xs leading-5 text-text-muted">
        Reaktionen und Notizen werden nicht mitkopiert.
      </p>
    </section>
  );
}
