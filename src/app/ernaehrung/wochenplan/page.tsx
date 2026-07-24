import Link from "next/link";

import {
  logPlannedMeal,
  planRecipe,
  removePlannedMeal,
} from "@/app/ernaehrung/wochenplan/actions";
import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { WeeklyPlanSubmit } from "@/components/nutrition/weekly-plan-submit";
import { Card, CardContent } from "@/components/ui/card";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import type { MealType } from "@/generated/prisma/enums";
import { estimatedFoodEnergy } from "@/lib/nutrition/energy";
import {
  addIsoDays,
  isIsoDate,
  isoWeekDates,
} from "@/lib/nutrition/weekly-plan";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  dateInTimeZone,
  defaultLocale,
  defaultTimeZone,
} from "@/lib/user-settings";

export const dynamic = "force-dynamic";

const mealSlots: Array<{ type: MealType; label: string }> = [
  { type: "BREAKFAST", label: "Frühstück" },
  { type: "LUNCH", label: "Mittagessen" },
  { type: "DINNER", label: "Abendessen" },
  { type: "SNACK", label: "Snack" },
];

type WeeklyPlanPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function queryValue(
  query: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const value = query[name];
  return Array.isArray(value) ? value[0] : value;
}

function itemLabel(item: {
  name: string;
  quantity: { toString(): string } | null;
  unit: string | null;
}): string {
  return item.quantity
    ? `${item.name} · ${item.quantity.toString()} ${item.unit === "MILLILITER" ? "ml" : "g"}`
    : item.name;
}

function recipeEnergy(items: Array<{
  energyKcal: unknown;
  foodKey: string | null;
  quantity: unknown;
}>): number | null {
  return items.some((item) => estimatedFoodEnergy(item) !== null)
    ? Math.round(
        items.reduce(
          (sum, item) => sum + (estimatedFoodEnergy(item) ?? 0),
          0,
        ),
      )
    : null;
}

export default async function WeeklyPlanPage({
  searchParams,
}: WeeklyPlanPageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
    select: { timeZone: true, locale: true },
  });
  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const locale = settings?.locale ?? defaultLocale;
  const today = dateInTimeZone(new Date(), timeZone);
  const requestedDate = queryValue(query, "date");
  const selectedDate = requestedDate && isIsoDate(requestedDate)
    ? requestedDate
    : today;
  const weekDates = isoWeekDates(selectedDate);
  const weekStart = weekDates[0];
  const weekEnd = weekDates[6];

  const [recipes, planEntries] = await Promise.all([
    prisma.recipe.findMany({
      where: {
        userId: user.id,
        archivedAt: null,
        type: { in: mealSlots.map(({ type }) => type) },
      },
      include: { items: { orderBy: { position: "asc" } } },
      orderBy: { name: "asc" },
    }),
    prisma.mealPlanEntry.findMany({
      where: {
        userId: user.id,
        plannedDate: {
          gte: new Date(`${weekStart}T00:00:00.000Z`),
          lte: new Date(`${weekEnd}T00:00:00.000Z`),
        },
      },
      include: {
        recipe: {
          include: { items: { orderBy: { position: "asc" } } },
        },
      },
      orderBy: [{ plannedDate: "asc" }, { type: "asc" }],
    }),
  ]);

  const dayFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });
  const longDateFormatter = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const shortDateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });
  const dateObject = (date: string) => new Date(`${date}T12:00:00.000Z`);
  const selectedEntries = planEntries.filter(
    (entry) => entry.plannedDate.toISOString().slice(0, 10) === selectedDate,
  );
  const plannedCountByDate = new Map(
    weekDates.map((date) => [
      date,
      planEntries.filter(
        (entry) => entry.plannedDate.toISOString().slice(0, 10) === date,
      ).length,
    ]),
  );
  const statusMessage = queryValue(query, "saved")
    ? "Mahlzeit wurde eingeplant."
    : queryValue(query, "removed")
      ? "Planung wurde entfernt."
      : queryValue(query, "logged")
        ? "Geplante Mahlzeit wurde erfasst."
        : null;
  const error = queryValue(query, "error");
  const errorMessage = error === "future"
    ? "Eine zukünftige Mahlzeit kann noch nicht als gegessen erfasst werden."
    : error === "completed"
      ? "Diese Planung wurde bereits erfasst und kann nicht überschrieben werden."
      : error === "recipe"
        ? "Die ausgewählte Vorlage ist nicht mehr verfügbar."
        : error
          ? "Bitte prüfe Datum und ausgewählte Vorlage."
          : null;

  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <Link
            href={`/ernaehrung?date=${selectedDate}`}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-forest-strong"
          >
            ← Zurück zur Ernährung
          </Link>
          <PageTitle className="mt-3">Wochenplan</PageTitle>
          <PageSubtitle className="mt-4">
            Plane wiederkehrende Mahlzeiten mit deinen strukturierten Vorlagen.
          </PageSubtitle>
        </header>

        {statusMessage ? (
          <p role="status" className="mt-8 max-w-4xl rounded-[var(--radius-md)] border border-forest-soft bg-forest-soft px-4 py-3 text-sm font-semibold text-forest-strong">
            {statusMessage}
          </p>
        ) : null}
        {errorMessage ? (
          <p role="alert" className="mt-8 max-w-4xl rounded-[var(--radius-md)] border border-danger bg-surface-raised px-4 py-3 text-sm font-semibold text-danger">
            {errorMessage}
          </p>
        ) : null}

        <section className="mt-8 w-full min-w-0 max-w-4xl overflow-hidden" aria-label="Wochenauswahl">
          <div className="flex items-center justify-between gap-3">
            <Link
              href={`/ernaehrung/wochenplan?date=${addIsoDays(weekStart, -7)}`}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-surface-raised text-xl text-forest-strong"
              aria-label="Vorherige Woche"
            >
              ←
            </Link>
            <p className="text-center text-sm font-semibold text-text-primary">
              {shortDateFormatter.format(dateObject(weekStart))}–{shortDateFormatter.format(dateObject(weekEnd))}
            </p>
            <Link
              href={`/ernaehrung/wochenplan?date=${addIsoDays(weekStart, 7)}`}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-surface-raised text-xl text-forest-strong"
              aria-label="Nächste Woche"
            >
              →
            </Link>
          </div>

          <div className="mt-4 flex w-[calc(100vw-2rem)] max-w-full snap-x gap-2 overflow-x-auto pb-2">
            {weekDates.map((date) => {
              const selected = date === selectedDate;
              const count = plannedCountByDate.get(date) ?? 0;
              return (
                <Link
                  key={date}
                  href={`/ernaehrung/wochenplan?date=${date}`}
                  aria-current={selected ? "date" : undefined}
                  className={`flex min-h-16 min-w-20 shrink-0 snap-start flex-col items-center justify-center rounded-[var(--radius-md)] border px-3 text-center ${selected ? "border-forest-strong bg-forest-soft text-forest-strong" : "border-border-subtle bg-surface-raised text-text-primary"}`}
                >
                  <span className="text-sm font-semibold">
                    {dayFormatter.format(dateObject(date))}
                  </span>
                  <span className="mt-1 text-xs text-text-muted">
                    {count} {count === 1 ? "Plan" : "Pläne"}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="mt-8 max-w-4xl" aria-labelledby="selected-day-heading">
          <h2 id="selected-day-heading" className="text-xl font-semibold capitalize text-text-primary">
            {longDateFormatter.format(dateObject(selectedDate))}
          </h2>
          <p className="mt-1 text-sm text-text-muted">
            {selectedEntries.length} von {mealSlots.length} Mahlzeiten geplant
          </p>

          <div className="mt-5 grid gap-4">
            {mealSlots.map((slot) => {
              const planEntry = selectedEntries.find(
                (entry) => entry.type === slot.type,
              );
              const availableRecipes = recipes.filter(
                (recipe) => recipe.type === slot.type && recipe.id !== planEntry?.recipeId,
              );
              const plannedEnergy = planEntry
                ? recipeEnergy(planEntry.recipe.items)
                : null;

              return (
                <Card key={slot.type} className="min-w-0">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold text-text-primary">
                        {slot.label}
                      </h3>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold ${planEntry?.completedAt ? "bg-forest-soft text-forest-strong" : "bg-surface-muted text-text-muted"}`}>
                        {planEntry?.completedAt ? "Erfasst" : planEntry ? "Geplant" : "Offen"}
                      </span>
                    </div>

                    {planEntry ? (
                      <div className="mt-4 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary p-4">
                        <div className="flex flex-wrap items-start justify-between gap-2">
                          <p className="font-semibold text-text-primary">
                            {planEntry.recipe.name}
                          </p>
                          {plannedEnergy !== null ? (
                            <span className="text-xs font-semibold text-copper">
                              ca. {plannedEnergy} kcal
                            </span>
                          ) : null}
                        </div>
                        <ul className="mt-3 grid gap-1 text-sm text-text-muted">
                          {planEntry.recipe.items.slice(0, 4).map((item) => (
                            <li key={item.id}>{itemLabel(item)}</li>
                          ))}
                        </ul>

                        {planEntry.completedAt ? (
                          <Link
                            href={`/ernaehrung?date=${selectedDate}`}
                            className="mt-4 inline-flex min-h-12 items-center font-semibold text-forest-strong"
                          >
                            Erfasste Mahlzeit ansehen →
                          </Link>
                        ) : (
                          <div className="mt-4 grid gap-2 sm:grid-cols-2">
                            {selectedDate <= today ? (
                              <form action={logPlannedMeal}>
                                <input type="hidden" name="plannedDate" value={selectedDate} />
                                <input type="hidden" name="planEntryId" value={planEntry.id} />
                                <WeeklyPlanSubmit pendingLabel="Wird erfasst …" variant="primary" className="w-full">
                                  Als Mahlzeit erfassen
                                </WeeklyPlanSubmit>
                              </form>
                            ) : (
                              <p className="flex min-h-12 items-center text-sm text-text-muted">
                                Am geplanten Tag erfassen
                              </p>
                            )}
                            <form action={removePlannedMeal}>
                              <input type="hidden" name="plannedDate" value={selectedDate} />
                              <input type="hidden" name="planEntryId" value={planEntry.id} />
                              <WeeklyPlanSubmit pendingLabel="Wird entfernt …" variant="ghost" className="w-full">
                                Planung entfernen
                              </WeeklyPlanSubmit>
                            </form>
                          </div>
                        )}
                      </div>
                    ) : null}

                    {!planEntry?.completedAt ? (
                      availableRecipes.length > 0 ? (
                        <div className="mt-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
                            {planEntry ? "Andere Vorlage" : "Vorlage wählen"}
                          </p>
                          <div className="mt-3 flex gap-2 overflow-x-auto pb-2">
                            {availableRecipes.map((recipe) => {
                              const energy = recipeEnergy(recipe.items);
                              return (
                                <form key={recipe.id} action={planRecipe} className="shrink-0">
                                  <input type="hidden" name="plannedDate" value={selectedDate} />
                                  <input type="hidden" name="recipeId" value={recipe.id} />
                                  <input type="hidden" name="type" value={slot.type} />
                                  <WeeklyPlanSubmit pendingLabel="Wird geplant …" className="min-h-16 w-52 flex-col items-start text-left">
                                    <span>{recipe.name}</span>
                                    <span className="mt-1 text-xs font-normal text-text-muted">
                                      {energy === null ? `${recipe.items.length} Zutaten` : `ca. ${energy} kcal`}
                                    </span>
                                  </WeeklyPlanSubmit>
                                </form>
                              );
                            })}
                          </div>
                        </div>
                      ) : !planEntry ? (
                        <div className="mt-4 rounded-[var(--radius-md)] bg-surface-muted p-4">
                          <p className="text-sm text-text-muted">
                            Noch keine passende Vorlage vorhanden.
                          </p>
                          <Link
                            href={`/ernaehrung?date=${selectedDate}`}
                            className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-forest-strong"
                          >
                            Mahlzeit erfassen und speichern →
                          </Link>
                        </div>
                      ) : null
                    ) : null}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>
      </Page>
    </AppLayout>
  );
}
