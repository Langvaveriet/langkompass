import Link from "next/link";

import {
  planSuggestedRecipe,
  saveSuggestedRecipe,
} from "@/app/ernaehrung/actions";
import { WeeklyPlanSubmit } from "@/components/nutrition/weekly-plan-submit";
import type { CuratedRecipe } from "@/lib/nutrition/curated-recipes";

const mealFilters: Array<{
  type: CuratedRecipe["type"] | null;
  label: string;
}> = [
  { type: null, label: "Alle" },
  { type: "BREAKFAST", label: "Frühstück" },
  { type: "LUNCH", label: "Mittagessen" },
  { type: "DINNER", label: "Abendessen" },
  { type: "SNACK", label: "Snack" },
];

const mealLabels: Record<CuratedRecipe["type"], string> = {
  BREAKFAST: "Frühstück",
  LUNCH: "Mittagessen",
  DINNER: "Abendessen",
  SNACK: "Snack",
};

function suggestionUrl(
  date: string,
  seed: string,
  type: CuratedRecipe["type"] | null,
): string {
  const params = new URLSearchParams({ date, suggest: seed });
  if (type) params.set("suggestionType", type);
  return `/ernaehrung?${params.toString()}`;
}

export function CuratedRecipeSuggestion({
  date,
  nextSeed,
  recipe,
  selectedType,
}: {
  date: string;
  nextSeed: string;
  recipe: CuratedRecipe;
  selectedType: CuratedRecipe["type"] | null;
}) {
  const energyKcal = recipe.items.reduce(
    (sum, item) => sum + item.energyKcal,
    0,
  );

  return (
    <section
      className="mt-8 w-full min-w-0 max-w-4xl overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised shadow-sm"
      aria-labelledby="recipe-idea-heading"
    >
      <div className="bg-forest-soft px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-forest-strong">
              Mediterran · ketogen ausgerichtet
            </p>
            <h2
              id="recipe-idea-heading"
              className="mt-1 text-xl font-semibold text-text-primary"
            >
              Gericht vorschlagen
            </h2>
          </div>
          <Link
            href={suggestionUrl(date, nextSeed, selectedType)}
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] bg-forest-strong px-5 text-sm font-semibold text-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest-strong focus-visible:ring-offset-2"
          >
            Anderes vorschlagen
          </Link>
        </div>

        <nav
          aria-label="Mahlzeitentyp für Rezeptvorschläge"
          className="mt-4 flex max-w-full gap-2 overflow-x-auto pb-1"
        >
          {mealFilters.map((filter) => {
            const selected = selectedType === filter.type;
            return (
              <Link
                key={filter.label}
                href={suggestionUrl(date, `${nextSeed}-${filter.label}`, filter.type)}
                aria-current={selected ? "page" : undefined}
                className={[
                  "inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold",
                  selected
                    ? "border-forest-strong bg-surface-raised text-forest-strong"
                    : "border-border-subtle bg-surface-primary text-text-primary",
                ].join(" ")}
              >
                {filter.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0">
          <div className="flex items-start gap-4">
            <span
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-surface-muted text-3xl"
              aria-hidden="true"
            >
              {recipe.emoji}
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-text-muted">
                {mealLabels[recipe.type]} · {recipe.prepMinutes} Min.
              </p>
              <h3 className="mt-1 text-xl font-semibold leading-7 text-text-primary">
                {recipe.name}
              </h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                {recipe.description}
              </p>
            </div>
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
              <dt className="text-xs text-text-muted">Energie</dt>
              <dd className="mt-1 text-sm font-semibold text-text-primary">
                ca. {energyKcal} kcal
              </dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
              <dt className="text-xs text-text-muted">Kohlenhydrate</dt>
              <dd className="mt-1 text-sm font-semibold text-text-primary">
                ca. {recipe.carbohydrateGrams} g
              </dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
              <dt className="text-xs text-text-muted">Eiweiß</dt>
              <dd className="mt-1 text-sm font-semibold text-text-primary">
                ca. {recipe.proteinGrams} g
              </dd>
            </div>
            <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
              <dt className="text-xs text-text-muted">Fett</dt>
              <dd className="mt-1 text-sm font-semibold text-text-primary">
                ca. {recipe.fatGrams} g
              </dd>
            </div>
          </dl>

          <details className="mt-5 rounded-[var(--radius-md)] border border-border-subtle">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold text-forest-strong">
              Zutaten und Zubereitung
              <span aria-hidden="true">＋</span>
            </summary>
            <div className="grid gap-5 border-t border-border-subtle p-4 sm:grid-cols-2">
              <div>
                <h4 className="text-sm font-semibold text-text-primary">
                  Zutaten für {recipe.servings} Portion
                </h4>
                <ul className="mt-2 grid gap-1 text-sm leading-6 text-text-muted">
                  {recipe.items.map((item) => (
                    <li key={item.name}>
                      {item.name} · {item.quantity} {item.unit === "MILLILITER" ? "ml" : "g"}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-primary">
                  Zubereitung
                </h4>
                <ol className="mt-2 grid list-decimal gap-2 pl-5 text-sm leading-6 text-text-muted">
                  {recipe.instructions.map((instruction) => (
                    <li key={instruction}>{instruction}</li>
                  ))}
                </ol>
              </div>
            </div>
          </details>
        </div>

        <aside className="grid content-start gap-3 rounded-[var(--radius-md)] bg-surface-muted p-4">
          <p className="text-xs leading-5 text-text-muted">
            Nährwerte sind Näherungen pro Portion. Persönliche Verträglichkeit
            und medizinische Vorgaben werden noch nicht automatisch geprüft.
          </p>

          <form action={saveSuggestedRecipe}>
            <input type="hidden" name="entryDate" value={date} />
            <input type="hidden" name="suggestionKey" value={recipe.key} />
            <WeeklyPlanSubmit
              pendingLabel="Wird gespeichert …"
              variant="secondary"
              className="w-full"
            >
              Als Vorlage speichern
            </WeeklyPlanSubmit>
          </form>

          <form action={planSuggestedRecipe}>
            <input type="hidden" name="entryDate" value={date} />
            <input type="hidden" name="suggestionKey" value={recipe.key} />
            <WeeklyPlanSubmit
              pendingLabel="Wird eingeplant …"
              variant="primary"
              className="w-full"
            >
              Für diesen Tag planen
            </WeeklyPlanSubmit>
          </form>

          <a
            href="https://www.chefkoch.de/rs/s0/mediterran%2Bketo/Rezepte.html"
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] px-4 text-center text-sm font-semibold text-forest-strong"
          >
            Weitere Ideen auf Chefkoch ↗
          </a>
        </aside>
      </div>
    </section>
  );
}
