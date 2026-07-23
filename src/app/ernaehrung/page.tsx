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
import { foodCatalogByKey } from "@/lib/nutrition/food-catalog";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
const LOCAL_USER_EMAIL = "local-user@langkompass.invalid";
const DAILY_ENERGY_REFERENCE_KCAL = 2000;
const mealLabels: Record<MealType, string> = { BREAKFAST: "Frühstück", LUNCH: "Mittagessen", DINNER: "Abendessen", SNACK: "Snack", DRINK: "Getränk" };

type PageProps = { searchParams: Promise<{ date?: string; edit?: string; saved?: string; deleted?: string; error?: string }> };

function today(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
}

function validDate(value?: string): string {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : today();
}

function currentTime(): string {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Stockholm", hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date());
}

function estimatedEnergy(item: {
  energyKcal: unknown;
  foodKey: string | null;
  quantity: unknown;
}): number | null {
  if (item.energyKcal !== null && item.energyKcal !== undefined) {
    return Number(item.energyKcal);
  }

  const food = item.foodKey ? foodCatalogByKey.get(item.foodKey) : null;
  if (!food || item.quantity === null || item.quantity === undefined) {
    return null;
  }

  return Math.round((food.kcalPer100 * Number(item.quantity)) / 100);
}

export default async function ErnaehrungPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const date = validDate(query.date);
  const user = await prisma.user.findUnique({
    where: { email: LOCAL_USER_EMAIL },
    select: { id: true, healthProfile: true },
  });
  const entry = user ? await prisma.dailyEntry.findUnique({
    where: { userId_entryDate: { userId: user.id, entryDate: new Date(`${date}T00:00:00.000Z`) } },
    include: { meals: { include: { items: true }, orderBy: { consumedAt: "asc" } } },
  }) : null;
  const editedMeal = query.edit ? entry?.meals.find((meal) => meal.id === query.edit) : undefined;
  const values = editedMeal ? {
    id: editedMeal.id,
    type: editedMeal.type,
    time: editedMeal.consumedAt.toISOString().slice(11, 16),
    foods: editedMeal.items.flatMap((item) => item.foodKey
      ? [{ key: item.foodKey, portion: item.portion }]
      : []),
    customFood: editedMeal.items.filter((item) => !item.foodKey).map((item) => item.name).join(", "),
    customQuantity: editedMeal.items.find((item) => !item.foodKey)?.quantity?.toString() ?? "",
    notes: editedMeal.notes ?? "",
  } : { type: "BREAKFAST" as const, time: currentTime(), foods: [], customFood: "", customQuantity: "", notes: "" };
  const personalEnergyTarget = calculateDailyCalorieTarget(
    user?.healthProfile,
    new Date(`${date}T12:00:00.000Z`),
  );
  const dailyEnergyTarget =
    personalEnergyTarget ?? DAILY_ENERGY_REFERENCE_KCAL;
  const mealEnergy = new Map(
    entry?.meals.map((meal) => [
      meal.id,
      meal.items.reduce(
        (sum, item) => sum + (estimatedEnergy(item) ?? 0),
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
      count + meal.items.filter((item) => estimatedEnergy(item) === null).length,
    0,
  ) ?? 0;

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

          <div className="grid gap-4 p-5">
            <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
              <div>
                <p className="text-3xl font-semibold tracking-tight text-text-primary">
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

            <div className="h-3 overflow-hidden rounded-full border border-border-strong bg-surface-muted" role="progressbar" aria-label="Kalorienfortschritt" aria-valuenow={dailyEnergy} aria-valuemin={0} aria-valuemax={dailyEnergyTarget}>
              <div className="h-full rounded-full bg-forest-strong transition-[width]" style={{ width: `${dailyEnergyProgress}%` }} />
            </div>

            <p className="text-xs leading-5 text-text-muted">
              {personalEnergyTarget
                ? "Näherungswert aus Profil, Aktivität und Gewichtsziel – kein medizinischer Grenzwert."
                : "Allgemeiner EU-Referenzwert für Erwachsene. Vervollständige dein Gesundheitsprofil für einen persönlichen Näherungswert."}
              {uncalculatedItems > 0 ? ` ${uncalculatedItems} individueller Eintrag wurde nicht mitberechnet.` : ""}
            </p>
          </div>
        </section>

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
                        <div><p className="font-semibold text-text-primary">{mealLabels[meal.type]}</p><p className="mt-1 text-xs text-text-muted">{meal.consumedAt.toISOString().slice(11, 16)} Uhr</p></div>
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
