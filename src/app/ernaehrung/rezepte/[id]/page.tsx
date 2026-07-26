import Link from "next/link";
import { notFound } from "next/navigation";

import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { RecipeDetailActions } from "@/components/nutrition/recipe-detail-actions";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import type { DietaryPattern, MealType } from "@/generated/prisma/enums";
import { estimatedFoodEnergy } from "@/lib/nutrition/energy";
import {
  buildMicronutrientSourceHints,
  rankRecipeAlternatives,
} from "@/lib/nutrition/recipe-insights";
import { isIsoDate } from "@/lib/nutrition/weekly-plan";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  dateInTimeZone,
  defaultTimeZone,
} from "@/lib/user-settings";

export const dynamic = "force-dynamic";

const mealLabels: Record<MealType, string> = {
  BREAKFAST: "Frühstück",
  LUNCH: "Mittagessen",
  DINNER: "Abendessen",
  SNACK: "Snack",
  DRINK: "Getränk",
};

const dietaryPatternLabels: Record<DietaryPattern, string> = {
  MEDITERRANEAN: "Mediterran",
  KETOGENIC: "Ketogen",
  VEGETARIAN: "Vegetarisch",
};

type RecipeDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ date?: string }>;
};

function amountLabel(item: {
  quantity: { toString(): string } | null;
  unit: string | null;
}): string | null {
  if (!item.quantity) return null;
  const unit = item.unit === "MILLILITER" ? "ml" : "g";
  return `${item.quantity.toString()} ${unit}`;
}

export default async function RecipeDetailPage({
  params,
  searchParams,
}: RecipeDetailPageProps) {
  const user = await requireUser();
  const [{ id }, query, settings] = await Promise.all([
    params,
    searchParams,
    prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: { timeZone: true },
    }),
  ]);
  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const date = query.date && isIsoDate(query.date)
    ? query.date
    : dateInTimeZone(new Date(), timeZone);
  const recipe = await prisma.recipe.findFirst({
    where: { id, userId: user.id, archivedAt: null },
    include: { items: { orderBy: { position: "asc" } } },
  });

  if (!recipe || recipe.items.length === 0) notFound();

  const alternativeCandidates = await prisma.recipe.findMany({
    where: {
      userId: user.id,
      archivedAt: null,
      type: recipe.type,
      id: { not: recipe.id },
    },
    orderBy: { updatedAt: "desc" },
    take: 20,
    include: { items: { orderBy: { position: "asc" } } },
  });
  const alternatives = rankRecipeAlternatives(recipe, alternativeCandidates);
  const micronutrientHints = buildMicronutrientSourceHints(recipe.items);

  const energyKcal = recipe.items.some(
    (item) => estimatedFoodEnergy(item) !== null,
  )
    ? Math.round(
        recipe.items.reduce(
          (sum, item) => sum + (estimatedFoodEnergy(item) ?? 0),
          0,
        ),
      )
    : null;
  const instructions = recipe.instructions
    ?.split("\n")
    .map((instruction) => instruction.trim())
    .filter(Boolean) ?? [];
  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <Link
            href={`/ernaehrung?date=${date}`}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-forest-strong"
          >
            ← Zurück zur Ernährung
          </Link>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-forest-soft px-3 py-1.5 text-xs font-semibold text-forest-strong">
              {recipe.origin === "CURATED" ? "Favorit" : "Eigene Vorlage"}
            </span>
            <span className="rounded-full bg-surface-muted px-3 py-1.5 text-xs font-semibold text-text-muted">
              {mealLabels[recipe.type]}
            </span>
          </div>
          <PageTitle className="mt-4">{recipe.name}</PageTitle>
          <PageSubtitle className="mt-4">
            {recipe.description ?? "Deine gespeicherte Mahlzeit mit strukturierten Mengen und Nährwerten."}
          </PageSubtitle>
        </header>

        <div className="mt-8 grid max-w-4xl gap-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="grid min-w-0 gap-5">
            <section className="rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised p-5" aria-labelledby="nutrition-heading">
              <h2 id="nutrition-heading" className="text-lg font-semibold text-text-primary">Auf einen Blick</h2>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
                  <dt className="text-xs text-text-muted">Energie</dt>
                  <dd className="mt-1 font-semibold text-text-primary">{energyKcal === null ? "–" : `ca. ${energyKcal} kcal`}</dd>
                </div>
                <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
                  <dt className="text-xs text-text-muted">Kohlenhydrate</dt>
                  <dd className="mt-1 font-semibold text-text-primary">{recipe.carbohydrateGrams === null ? "–" : `ca. ${recipe.carbohydrateGrams.toString()} g`}</dd>
                </div>
                <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
                  <dt className="text-xs text-text-muted">Eiweiß</dt>
                  <dd className="mt-1 font-semibold text-text-primary">{recipe.proteinGrams === null ? "–" : `ca. ${recipe.proteinGrams.toString()} g`}</dd>
                </div>
                <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
                  <dt className="text-xs text-text-muted">Fett</dt>
                  <dd className="mt-1 font-semibold text-text-primary">{recipe.fatGrams === null ? "–" : `ca. ${recipe.fatGrams.toString()} g`}</dd>
                </div>
              </dl>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-text-muted">
                {recipe.prepMinutes ? <span className="rounded-full border border-border-subtle px-3 py-1.5">{recipe.prepMinutes} Min.</span> : null}
                {recipe.servings ? <span className="rounded-full border border-border-subtle px-3 py-1.5">{recipe.servings} {recipe.servings === 1 ? "Portion" : "Portionen"}</span> : null}
                {recipe.dietaryPatterns.map((pattern) => (
                  <span key={pattern} className="rounded-full border border-border-subtle px-3 py-1.5">
                    {dietaryPatternLabels[pattern]}
                  </span>
                ))}
              </div>
              {micronutrientHints.length > 0 ? (
                <div className="mt-5 border-t border-border-subtle pt-4">
                  <h3 className="text-sm font-semibold text-text-primary">Mögliche Mikronährstoff-Quellen</h3>
                  <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                    {micronutrientHints.map((hint) => (
                      <li key={hint.nutrient} className="rounded-[var(--radius-md)] bg-surface-muted p-3 text-sm">
                        <strong className="block text-text-primary">{hint.nutrient}</strong>
                        <span className="mt-1 block text-xs leading-5 text-text-muted">Quelle im Rezept: {hint.sources.join(", ")}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs leading-5 text-text-muted">Quellenhinweise aus den Zutaten, keine berechneten Mengen oder medizinische Bewertung.</p>
                </div>
              ) : null}
            </section>

            <section className="rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised p-5" aria-labelledby="ingredients-heading">
              <h2 id="ingredients-heading" className="text-lg font-semibold text-text-primary">Zutaten</h2>
              <ul className="mt-4 divide-y divide-border-subtle">
                {recipe.items.map((item) => (
                  <li key={item.id} className="flex min-h-12 items-center justify-between gap-4 py-2 text-sm">
                    <span className="font-medium text-text-primary">{item.name}</span>
                    <span className="shrink-0 text-text-muted">{amountLabel(item) ?? "nach Bedarf"}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised p-5" aria-labelledby="instructions-heading">
              <h2 id="instructions-heading" className="text-lg font-semibold text-text-primary">Zubereitung</h2>
              {instructions.length > 0 ? (
                <ol className="mt-4 grid list-decimal gap-3 pl-5 text-sm leading-6 text-text-primary">
                  {instructions.map((instruction) => <li key={instruction}>{instruction}</li>)}
                </ol>
              ) : (
                <p className="mt-3 text-sm leading-6 text-text-muted">
                  Für diese eigene Mahlzeitenvorlage wurde keine Zubereitung gespeichert.
                </p>
              )}
            </section>

            {alternatives.length > 0 ? (
              <section className="rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised p-5" aria-labelledby="alternatives-heading">
                <h2 id="alternatives-heading" className="text-lg font-semibold text-text-primary">Passende Alternativen</h2>
                <p className="mt-2 text-sm leading-6 text-text-muted">Ähnliche Rezepte nach Ernährungsrichtung und Lebensmittelgruppen.</p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {alternatives.map((alternative) => (
                    <Link
                      key={alternative.id}
                      href={`/ernaehrung/rezepte/${alternative.id}?date=${date}`}
                      className="flex min-h-24 flex-col justify-between rounded-[var(--radius-md)] border border-border-subtle p-4"
                    >
                      <strong className="text-sm text-text-primary">{alternative.name}</strong>
                      <span className="mt-3 text-xs font-semibold text-forest-strong">Rezept ansehen →</span>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>

          <RecipeDetailActions
            initialDate={date}
            recipeId={recipe.id}
            type={recipe.type}
          />
        </div>
      </Page>
    </AppLayout>
  );
}
