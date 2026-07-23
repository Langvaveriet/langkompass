import Link from "next/link";

import { deleteMeal } from "@/app/ernaehrung/actions";
import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { Section } from "@/components/layout/section";
import { MealForm } from "@/components/nutrition/meal-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import type { MealType } from "@/generated/prisma/enums";
import { calculateDailyCalorieTarget } from "@/lib/nutrition/calorie-target";
import { estimatedFoodEnergy } from "@/lib/nutrition/energy";
import {
  postMealSymptomLabels,
  reactionDelayLabels,
} from "@/lib/nutrition/post-meal-reactions";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  dateInTimeZone,
  defaultTimeZone,
  timeInTimeZone,
} from "@/lib/user-settings";

export const dynamic = "force-dynamic";
const DAILY_ENERGY_REFERENCE_KCAL = 2000;
const mealLabels: Record<MealType, string> = { BREAKFAST: "Frühstück", LUNCH: "Mittagessen", DINNER: "Abendessen", SNACK: "Snack", DRINK: "Getränk" };

type PageProps = { searchParams: Promise<{ date?: string; edit?: string; saved?: string; deleted?: string; error?: string }> };

function validDate(value: string | undefined, timeZone: string): string {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : dateInTimeZone(new Date(), timeZone);
}

export default async function ErnaehrungPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const sessionUser = await requireUser();
  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      healthProfile: true,
      settings: true,
      measurements: {
        where: { type: "WEIGHT" },
        orderBy: { measuredAt: "desc" },
        take: 1,
      },
    },
  });
  const timeZone = user?.settings?.timeZone ?? defaultTimeZone;
  const date = validDate(query.date, timeZone);
  const entry = user ? await prisma.dailyEntry.findUnique({
    where: { userId_entryDate: { userId: user.id, entryDate: new Date(`${date}T00:00:00.000Z`) } },
    include: { meals: { include: { items: true }, orderBy: { consumedAt: "asc" } } },
  }) : null;
  const editedMeal = query.edit ? entry?.meals.find((meal) => meal.id === query.edit) : undefined;
  const values = editedMeal ? {
    id: editedMeal.id,
    type: editedMeal.type,
    time: timeInTimeZone(editedMeal.consumedAt, timeZone),
    foods: editedMeal.items.flatMap((item) => item.foodKey
      ? [{ key: item.foodKey, portion: item.portion }]
      : []),
    customFood: editedMeal.items.filter((item) => !item.foodKey).map((item) => item.name).join(", "),
    customQuantity: editedMeal.items.find((item) => !item.foodKey)?.quantity?.toString() ?? "",
    notes: editedMeal.notes ?? "",
    postMealSymptomTags: editedMeal.postMealSymptomTags,
    reactionDelayMinutes: editedMeal.reactionDelayMinutes,
  } : { type: "BREAKFAST" as const, time: timeInTimeZone(new Date(), timeZone), foods: [], customFood: "", customQuantity: "", notes: "", postMealSymptomTags: [], reactionDelayMinutes: null };
  const calorieTargetProfile = user?.healthProfile
    ? {
        ...user.healthProfile,
        weightKg:
          user.measurements[0]?.value ?? user.healthProfile.weightKg,
      }
    : null;
  const personalEnergyTarget = calculateDailyCalorieTarget(
    calorieTargetProfile,
    new Date(`${date}T12:00:00.000Z`),
  );
  const dailyEnergyTarget =
    personalEnergyTarget ?? DAILY_ENERGY_REFERENCE_KCAL;
  const mealEnergy = new Map(
    entry?.meals.map((meal) => [
      meal.id,
      meal.items.reduce(
        (sum, item) => sum + (estimatedFoodEnergy(item) ?? 0),
        0,
      ),
    ]) ?? [],
  );
  const dailyEnergy = Array.from(mealEnergy.values()).reduce(
    (sum, energy) => sum + energy,
    0,
  );
  const dailyEnergyProgress = Math.min(
    100,
    Math.round((dailyEnergy / dailyEnergyTarget) * 100),
  );
  const remainingDailyEnergy = dailyEnergyTarget - dailyEnergy;
  const uncalculatedItems = entry?.meals.reduce(
    (count, meal) =>
      count + meal.items.filter((item) => estimatedFoodEnergy(item) === null).length,
    0,
  ) ?? 0;
  const foodMeals = entry?.meals.filter((meal) => meal.type !== "DRINK") ?? [];
  const drinkEntries = entry?.meals.filter((meal) => meal.type === "DRINK").length ?? 0;
  const reactionEntries = entry?.meals.filter(
    (meal) => meal.postMealSymptomTags.length > 0,
  ).length ?? 0;
  const firstFoodMeal = foodMeals.at(0);
  const lastFoodMeal = foodMeals.at(-1);
  const mealWindowMinutes = firstFoodMeal && lastFoodMeal && foodMeals.length > 1
    ? Math.round(
        (lastFoodMeal.consumedAt.getTime() - firstFoodMeal.consumedAt.getTime()) /
          60_000,
      )
    : null;
  const mealWindowLabel = mealWindowMinutes !== null
    ? `${Math.floor(mealWindowMinutes / 60)} Std.${mealWindowMinutes % 60 > 0 ? ` ${mealWindowMinutes % 60} Min.` : ""}`
    : "Noch offen";
  const foodTraits = new Set(
    entry?.meals.flatMap((meal) => meal.items.flatMap((item) => item.traits)) ?? [],
  );
  const dailySignals = [
    foodTraits.has("HISTAMINE_RICH") || foodTraits.has("HISTAMINE_LIBERATOR")
      ? "Histaminbezug"
      : null,
    foodTraits.has("ALCOHOLIC") ? "Alkohol" : null,
    foodTraits.has("HIGH_SUGAR") ? "Hoher Zuckeranteil" : null,
    foodTraits.has("HIGHLY_PROCESSED") ? "Stark verarbeitet" : null,
    foodTraits.has("CAFFEINATED") ? "Koffein" : null,
  ].filter((signal): signal is string => signal !== null);

  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <PageTitle>Ernährung</PageTitle>
          <PageSubtitle className="mt-4">Mahlzeiten schnell dokumentieren und langfristige Zusammenhänge erkennen.</PageSubtitle>
        </header>

        {query.saved === "1" || query.deleted === "1" ? <div role="status" className="rounded-[var(--radius-md)] border border-border-subtle bg-forest-soft px-4 py-3 text-sm font-medium text-forest-strong">{query.deleted === "1" ? "Mahlzeit wurde gelöscht." : "Mahlzeit wurde gespeichert."}</div> : null}
        {query.error ? <div role="alert" className="rounded-[var(--radius-md)] border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">Bitte wähle Mahlzeit, Uhrzeit und mindestens ein Lebensmittel.</div> : null}

        <section className="mt-8 max-w-4xl overflow-hidden rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised shadow-sm" aria-label="Kalorienübersicht">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-forest-soft px-5 py-3">
            <h2 className="text-sm font-semibold text-forest-strong">Tagesenergie</h2>
            <span className="rounded-full bg-surface-raised px-3 py-1 text-xs font-semibold text-forest-strong">
              {personalEnergyTarget ? "Persönliches Ziel" : "Allgemeiner Richtwert"}
            </span>
          </div>

          <div className="grid gap-5" style={{ padding: "1.25rem" }}>
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <p className="font-semibold tracking-tight text-text-primary" style={{ fontSize: "1.875rem", lineHeight: "2.25rem" }}>
                  {dailyEnergy} kcal
                </p>
                <p className="mt-1 text-sm text-text-muted">
                  erfasst von ca. {dailyEnergyTarget} kcal
                </p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-lg font-semibold text-forest-strong">
                  {Math.round((dailyEnergy / dailyEnergyTarget) * 100)} %
                </p>
                <p className="text-sm text-text-muted">
                  {remainingDailyEnergy >= 0
                    ? `noch ca. ${remainingDailyEnergy} kcal`
                    : `ca. ${Math.abs(remainingDailyEnergy)} kcal über Ziel`}
                </p>
              </div>
            </div>

            <div className="overflow-hidden rounded-full border border-border-strong bg-surface-muted" style={{ height: "0.75rem" }} role="progressbar" aria-label="Kalorienfortschritt" aria-valuenow={dailyEnergy} aria-valuemin={0} aria-valuemax={dailyEnergyTarget}>
              <div className="rounded-full bg-forest-strong transition-[width]" style={{ width: `${dailyEnergyProgress}%`, height: "100%" }} />
            </div>

            <p className="text-xs leading-5 text-text-muted">
              {personalEnergyTarget
                ? "Näherungswert aus Profil, Aktivität und Gewichtsziel – kein medizinischer Grenzwert."
                : "Allgemeiner EU-Referenzwert für Erwachsene. Vervollständige dein Gesundheitsprofil für einen persönlichen Näherungswert."}
              {uncalculatedItems > 0 ? ` ${uncalculatedItems} individueller Eintrag wurde nicht mitberechnet.` : ""}
            </p>
          </div>
        </section>

        {entry && entry.meals.length > 0 ? (
          <section className="mt-5 max-w-4xl rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised" style={{ padding: "1.25rem" }} aria-labelledby="daily-pattern-heading">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 id="daily-pattern-heading" className="font-semibold text-text-primary">Tagesmuster</h2>
                <p className="mt-1 text-sm text-text-muted">Neutrale Zusammenfassung deiner strukturierten Einträge.</p>
              </div>
              <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted">
                {entry.meals.length} {entry.meals.length === 1 ? "Eintrag" : "Einträge"}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Rhythmus</p>
                <p className="mt-2 text-lg font-semibold text-text-primary">{foodMeals.length} {foodMeals.length === 1 ? "Mahlzeit" : "Mahlzeiten"}</p>
                <p className="mt-1 text-xs text-text-muted">{drinkEntries > 0 ? `${drinkEntries} ${drinkEntries === 1 ? "Getränkeeintrag" : "Getränkeeinträge"} zusätzlich` : "Keine Getränke separat erfasst"}</p>
              </div>

              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Essenszeitraum</p>
                <p className="mt-2 text-lg font-semibold text-text-primary">{mealWindowLabel}</p>
                <p className="mt-1 text-xs text-text-muted">
                  {firstFoodMeal && lastFoodMeal && foodMeals.length > 1
                    ? `${timeInTimeZone(firstFoodMeal.consumedAt, timeZone)}–${timeInTimeZone(lastFoodMeal.consumedAt, timeZone)} Uhr`
                    : "Ab zwei Mahlzeiten berechenbar"}
                </p>
              </div>

              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Reaktionen</p>
                <p className="mt-2 text-lg font-semibold text-text-primary">{reactionEntries}</p>
                <p className="mt-1 text-xs text-text-muted">Mahlzeiten mit erfassten Beschwerden</p>
              </div>
            </div>

            {dailySignals.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2" aria-label="Erfasste Lebensmittelmerkmale">
                {dailySignals.map((signal) => (
                  <span key={signal} className="rounded-full border border-border-subtle bg-surface-primary px-3 py-1.5 text-xs font-semibold text-text-muted">
                    {signal}
                  </span>
                ))}
              </div>
            ) : null}
          </section>
        ) : null}

        <div className="mt-8 max-w-sm">
          <form method="get" className="grid gap-2">
            <label htmlFor="date" className="text-sm font-semibold text-text-primary">Tag auswählen</label>
            <input id="date" name="date" type="date" defaultValue={date} className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base text-text-primary" />
            <button className="min-h-11 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 text-sm font-semibold text-text-primary">Tag anzeigen</button>
          </form>
        </div>

        <Section aria-label="Ernährungserfassung" className="grid grid-cols-12 gap-5">
          <Card className="col-span-12 xl:col-span-8">
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle>{editedMeal ? "Mahlzeit bearbeiten" : "Mahlzeit hinzufügen"}</CardTitle>
              {editedMeal ? <Link href={`/ernaehrung?date=${date}`} className="text-sm font-semibold text-forest-strong">Abbrechen</Link> : null}
            </CardHeader>
            <CardContent>
              <MealForm
                key={editedMeal?.id ?? `new-${date}`}
                entryDate={date}
                values={values}
              />
            </CardContent>
          </Card>

          <Card className="col-span-12 xl:col-span-4">
            <CardHeader><CardTitle>Mahlzeiten am Tag</CardTitle></CardHeader>
            <CardContent>
              {!entry || entry.meals.length === 0 ? <p className="text-sm leading-6 text-text-muted">Für diesen Tag wurden noch keine Mahlzeiten erfasst.</p> : (
                <ul className="grid gap-3">
                  {entry.meals.map((meal) => (
                    <li key={meal.id} className="rounded-[var(--radius-md)] border border-border-subtle p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div><p className="font-semibold text-text-primary">{mealLabels[meal.type]}</p><p className="mt-1 text-xs text-text-muted">{timeInTimeZone(meal.consumedAt, timeZone)} Uhr</p></div>
                        <Link href={`/ernaehrung?date=${date}&edit=${meal.id}`} className="text-sm font-semibold text-forest-strong">Bearbeiten</Link>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-copper">ca. {Math.round(mealEnergy.get(meal.id) ?? 0)} kcal</p>
                      <ul className="mt-3 grid gap-1 text-sm leading-6 text-text-primary">
                        {meal.items.map((item) => (
                          <li key={item.id}>
                            {item.name}
                            {item.quantity
                              ? ` · ${item.quantity.toString()} ${item.unit === "MILLILITER" ? "ml" : "g"}`
                              : ""}
                          </li>
                        ))}
                      </ul>
                      {meal.postMealSymptomTags.length > 0 ? (
                        <div className="mt-3 rounded-[var(--radius-md)] bg-surface-muted px-3 py-2 text-xs leading-5 text-text-muted">
                          <span className="font-semibold text-text-primary">Reaktion: </span>
                          {meal.postMealSymptomTags
                            .map((tag) => postMealSymptomLabels.get(tag) ?? tag)
                            .join(", ")}
                          {meal.reactionDelayMinutes !== null
                            ? ` · ${reactionDelayLabels.get(meal.reactionDelayMinutes) ?? `${meal.reactionDelayMinutes} Min. später`}`
                            : ""}
                        </div>
                      ) : null}
                      <form action={deleteMeal} className="mt-3">
                        <input type="hidden" name="entryDate" value={date} /><input type="hidden" name="mealId" value={meal.id} />
                        <button className="text-xs font-semibold text-danger">Löschen</button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </Section>
      </Page>
    </AppLayout>
  );
}
