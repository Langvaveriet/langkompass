import Link from "next/link";
import type { ReactNode } from "react";

import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import {
  RecipeSuggestions,
  type RecipeSuggestion,
} from "@/components/nutrition/recipe-suggestions";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import type { MealType } from "@/generated/prisma/enums";
import type { Prisma } from "@/generated/prisma/client";
import { estimatedFoodEnergy } from "@/lib/nutrition/energy";
import { isIsoDate } from "@/lib/nutrition/weekly-plan";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { dateInTimeZone, defaultTimeZone } from "@/lib/user-settings";

export const dynamic = "force-dynamic";

type LibraryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

type LibrarySource = "all" | "favorites" | "own";

const mealLabels: Record<MealType, string> = {
  BREAKFAST: "Frühstück",
  LUNCH: "Mittagessen",
  DINNER: "Abendessen",
  SNACK: "Snack",
  DRINK: "Getränk",
};

const mealFilters: Array<{ value: MealType | "all"; label: string }> = [
  { value: "all", label: "Alle" },
  { value: "BREAKFAST", label: "Frühstück" },
  { value: "LUNCH", label: "Mittagessen" },
  { value: "DINNER", label: "Abendessen" },
  { value: "SNACK", label: "Snack" },
];

const sourceFilters: Array<{ value: LibrarySource; label: string }> = [
  { value: "all", label: "Alle Rezepte" },
  { value: "favorites", label: "Favoriten" },
  { value: "own", label: "Eigene Vorlagen" },
];

const timeFilters: Array<{ value: number | null; label: string }> = [
  { value: null, label: "Alle Zeiten" },
  { value: 15, label: "bis 15 Min." },
  { value: 30, label: "bis 30 Min." },
  { value: 45, label: "bis 45 Min." },
  { value: 60, label: "bis 60 Min." },
];

function queryValue(
  query: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const value = query[name];
  return Array.isArray(value) ? value[0] : value;
}

function filterHref(
  values: { date: string; q: string; source: LibrarySource; type: MealType | null; maxMinutes: number | null },
  update: Partial<{ source: LibrarySource; type: MealType | null; maxMinutes: number | null }>,
): string {
  const next = { ...values, ...update };
  const params = new URLSearchParams({ date: next.date });
  if (next.q) params.set("q", next.q);
  if (next.source !== "all") params.set("source", next.source);
  if (next.type) params.set("type", next.type);
  if (next.maxMinutes) params.set("maxMinutes", next.maxMinutes.toString());
  return `/ernaehrung/rezepte?${params.toString()}`;
}

export default async function RecipeLibraryPage({ searchParams }: LibraryPageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
    select: { timeZone: true },
  });
  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const requestedDate = queryValue(query, "date");
  const date = requestedDate && isIsoDate(requestedDate)
    ? requestedDate
    : dateInTimeZone(new Date(), timeZone);
  const q = queryValue(query, "q")?.trim().slice(0, 80) ?? "";
  const sourceValue = queryValue(query, "source");
  const source: LibrarySource = sourceValue === "favorites" || sourceValue === "own"
    ? sourceValue
    : "all";
  const typeValue = queryValue(query, "type") as MealType | undefined;
  const allowedTypes = new Set<MealType>(["BREAKFAST", "LUNCH", "DINNER", "SNACK"]);
  const type = typeValue && allowedTypes.has(typeValue) ? typeValue : null;
  const parsedMaxMinutes = Number(queryValue(query, "maxMinutes"));
  const maxMinutes = [15, 30, 45, 60].includes(parsedMaxMinutes)
    ? parsedMaxMinutes
    : null;

  const conditions: Prisma.RecipeWhereInput[] = [
    {
      OR: [
        { origin: "USER" },
        { origin: "CURATED", favoriteAt: { not: null } },
      ],
    },
  ];
  if (source === "favorites") {
    conditions.push({ origin: "CURATED", favoriteAt: { not: null } });
  } else if (source === "own") {
    conditions.push({ origin: "USER" });
  }
  if (q) {
    conditions.push({
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { items: { some: { name: { contains: q, mode: "insensitive" } } } },
      ],
    });
  }

  const recipes = await prisma.recipe.findMany({
    where: {
      userId: user.id,
      archivedAt: null,
      type: type ?? undefined,
      prepMinutes: maxMinutes ? { lte: maxMinutes } : undefined,
      AND: conditions,
    },
    include: { items: { orderBy: { position: "asc" } } },
    orderBy: [{ favoriteAt: "desc" }, { updatedAt: "desc" }],
  });
  const recipeSuggestions: RecipeSuggestion[] = recipes.map((recipe) => ({
    id: recipe.id,
    name: recipe.name,
    origin: recipe.origin,
    mealLabel: mealLabels[recipe.type],
    energyKcal: recipe.items.some((item) => estimatedFoodEnergy(item) !== null)
      ? Math.round(
          recipe.items.reduce(
            (sum, item) => sum + (estimatedFoodEnergy(item) ?? 0),
            0,
          ),
        )
      : null,
    items: recipe.items.map((item) =>
      item.quantity
        ? `${item.name} · ${item.quantity.toString()} ${item.unit === "MILLILITER" ? "ml" : "g"}`
        : item.name,
    ),
  }));
  const currentFilters = { date, q, source, type, maxMinutes };
  const filtersActive = Boolean(q || source !== "all" || type || maxMinutes);

  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <Link href={`/ernaehrung?date=${date}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-forest-strong">
            ← Zurück zur Ernährung
          </Link>
          <PageTitle className="mt-3">Rezeptbibliothek</PageTitle>
          <PageSubtitle className="mt-4">Favoriten und eigene Vorlagen schnell finden und direkt verwenden.</PageSubtitle>
        </header>

        <section className="mt-8 max-w-4xl rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised p-4 sm:p-5" aria-labelledby="library-filter-heading">
          <h2 id="library-filter-heading" className="font-semibold text-text-primary">Rezepte filtern</h2>
          <form action="/ernaehrung/rezepte" method="get" className="mt-4 flex flex-col gap-3 sm:flex-row">
            <input type="hidden" name="date" value={date} />
            {source !== "all" ? <input type="hidden" name="source" value={source} /> : null}
            {type ? <input type="hidden" name="type" value={type} /> : null}
            {maxMinutes ? <input type="hidden" name="maxMinutes" value={maxMinutes} /> : null}
            <label htmlFor="recipe-search" className="sr-only">Rezept oder Zutat suchen</label>
            <input
              id="recipe-search"
              name="q"
              type="search"
              maxLength={80}
              defaultValue={q}
              placeholder="Rezept oder Zutat suchen"
              className="min-h-12 min-w-0 flex-1 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base text-text-primary"
            />
            <button className="min-h-12 rounded-[var(--radius-md)] bg-forest-strong px-5 text-sm font-semibold text-surface">Suchen</button>
          </form>

          <FilterGroup label="Bibliothek">
            {sourceFilters.map((filter) => (
              <FilterChip key={filter.value} href={filterHref(currentFilters, { source: filter.value })} selected={source === filter.value}>
                {filter.label}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="Mahlzeit">
            {mealFilters.map((filter) => (
              <FilterChip key={filter.value} href={filterHref(currentFilters, { type: filter.value === "all" ? null : filter.value })} selected={(type ?? "all") === filter.value}>
                {filter.label}
              </FilterChip>
            ))}
          </FilterGroup>
          <FilterGroup label="Zubereitungszeit">
            {timeFilters.map((filter) => (
              <FilterChip key={filter.label} href={filterHref(currentFilters, { maxMinutes: filter.value })} selected={maxMinutes === filter.value}>
                {filter.label}
              </FilterChip>
            ))}
          </FilterGroup>
        </section>

        <section className="mt-7 max-w-4xl" aria-labelledby="library-results-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="library-results-heading" className="text-lg font-semibold text-text-primary">
                {recipeSuggestions.length} {recipeSuggestions.length === 1 ? "Rezept" : "Rezepte"}
              </h2>
              <p className="mt-1 text-sm text-text-muted">Passend zu deiner aktuellen Auswahl.</p>
            </div>
            {filtersActive ? (
              <Link href={`/ernaehrung/rezepte?date=${date}`} className="inline-flex min-h-11 items-center text-sm font-semibold text-forest-strong">
                Filter zurücksetzen
              </Link>
            ) : null}
          </div>

          {recipeSuggestions.length > 0 ? (
            <RecipeSuggestions entryDate={date} recipes={recipeSuggestions} showHeader={false} />
          ) : (
            <div className="mt-4 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised p-5">
              <h3 className="font-semibold text-text-primary">Keine passenden Rezepte</h3>
              <p className="mt-2 text-sm leading-6 text-text-muted">Ändere einen Filter oder speichere auf der Ernährungsseite ein neues Lieblingsrezept.</p>
              <Link href={`/ernaehrung?date=${date}`} className="mt-4 inline-flex min-h-12 items-center rounded-[var(--radius-md)] bg-forest-strong px-4 text-sm font-semibold text-surface">
                Rezept vorschlagen lassen
              </Link>
            </div>
          )}
        </section>
      </Page>
    </AppLayout>
  );
}

function FilterGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mt-5">
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">{label}</p>
      <div className="mt-2 flex max-w-full gap-2 overflow-x-auto pb-1">{children}</div>
    </div>
  );
}

function FilterChip({ href, selected, children }: { href: string; selected: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={selected ? "page" : undefined}
      className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 text-sm font-semibold ${selected ? "border-forest-strong bg-forest-soft text-forest-strong" : "border-border-subtle bg-surface-primary text-text-primary"}`}
    >
      {children}
    </Link>
  );
}
