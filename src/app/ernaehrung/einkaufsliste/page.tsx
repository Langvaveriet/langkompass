import Link from "next/link";

import { toggleShoppingListItem } from "@/app/ernaehrung/einkaufsliste/actions";
import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { ShoppingListTransfer } from "@/components/nutrition/shopping-list-transfer";
import { Card, CardContent } from "@/components/ui/card";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import {
  buildShoppingList,
  foodCategoryLabels,
  foodCategoryOrder,
  formatShoppingQuantity,
  shoppingListTransferText,
} from "@/lib/nutrition/shopping-list";
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

type ShoppingListPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function queryValue(
  query: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const value = query[name];
  return Array.isArray(value) ? value[0] : value;
}

export default async function ShoppingListPage({
  searchParams,
}: ShoppingListPageProps) {
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
  const weekStartDate = new Date(`${weekStart}T00:00:00.000Z`);
  const weekEndDate = new Date(`${weekEnd}T00:00:00.000Z`);

  const [entries, itemStates] = await Promise.all([
    prisma.mealPlanEntry.findMany({
      where: {
        userId: user.id,
        plannedDate: { gte: weekStartDate, lte: weekEndDate },
      },
      select: {
        recipe: {
          select: {
            items: {
              select: {
                foodKey: true,
                name: true,
                category: true,
                quantity: true,
                unit: true,
              },
              orderBy: { position: "asc" },
            },
          },
        },
      },
      orderBy: [{ plannedDate: "asc" }, { type: "asc" }],
    }),
    prisma.shoppingListItemState.findMany({
      where: { userId: user.id, weekStart: weekStartDate },
      select: { itemKey: true, checkedAt: true },
    }),
  ]);

  const items = buildShoppingList(
    entries.flatMap((entry) => entry.recipe.items),
  );
  const checkedKeys = new Set(
    itemStates
      .filter((state) => state.checkedAt !== null)
      .map((state) => state.itemKey),
  );
  const openItems = items.filter((item) => !checkedKeys.has(item.key));
  const completedCount = items.length - openItems.length;
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "UTC",
  });
  const weekLabel = `${dateFormatter.format(weekStartDate)}–${dateFormatter.format(weekEndDate)}`;

  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <Link
            href={`/ernaehrung/wochenplan?date=${selectedDate}`}
            className="inline-flex min-h-11 items-center text-sm font-semibold text-forest-strong"
          >
            ← Zurück zum Wochenplan
          </Link>
          <PageTitle className="mt-3">Einkaufsliste</PageTitle>
          <PageSubtitle className="mt-4">
            Zutaten aus allen geplanten Rezepten der Woche, automatisch gebündelt.
          </PageSubtitle>
        </header>

        <section className="mt-8 max-w-4xl" aria-label="Wochenauswahl">
          <div className="flex items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised p-3">
            <Link
              href={`/ernaehrung/einkaufsliste?date=${addIsoDays(weekStart, -7)}`}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-[var(--radius-md)] border border-border-strong text-xl text-forest-strong"
              aria-label="Vorherige Woche"
            >
              ←
            </Link>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-text-muted">Woche</p>
              <p className="mt-1 text-sm font-semibold text-text-primary">{weekLabel}</p>
            </div>
            <Link
              href={`/ernaehrung/einkaufsliste?date=${addIsoDays(weekStart, 7)}`}
              className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-[var(--radius-md)] border border-border-strong text-xl text-forest-strong"
              aria-label="Nächste Woche"
            >
              →
            </Link>
          </div>
        </section>

        {items.length === 0 ? (
          <Card className="mt-6 max-w-4xl">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-text-primary">Noch keine Zutaten</h2>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Plane zuerst mindestens eine Mahlzeit in dieser Woche. Danach erscheint ihre Zutatenliste hier automatisch.
              </p>
              <Link
                href={`/ernaehrung/wochenplan?date=${selectedDate}`}
                className="mt-5 inline-flex min-h-12 items-center rounded-[var(--radius-md)] bg-forest-strong px-5 text-sm font-semibold text-surface"
              >
                Woche planen →
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <section className="mt-6 max-w-4xl rounded-[var(--radius-lg)] border border-border-strong bg-forest-soft p-5" aria-label="Einkaufsfortschritt">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-forest-strong">Einkaufsfortschritt</p>
                  <p className="mt-1 text-2xl font-semibold text-text-primary">
                    {openItems.length} {openItems.length === 1 ? "Position" : "Positionen"} offen
                  </p>
                </div>
                <span className="rounded-full bg-surface-raised px-3 py-1.5 text-xs font-semibold text-forest-strong">
                  {completedCount} von {items.length} erledigt
                </span>
              </div>
            </section>

            <section className="mt-6 grid max-w-4xl gap-5" aria-label="Zutatenliste">
              {foodCategoryOrder.map((category) => {
                const categoryItems = items.filter((item) => item.category === category);
                if (categoryItems.length === 0) return null;

                return (
                  <Card key={category}>
                    <CardContent className="p-4 sm:p-5">
                      <h2 className="text-sm font-semibold uppercase tracking-[0.1em] text-text-muted">
                        {foodCategoryLabels[category]}
                      </h2>
                      <div className="mt-3 grid gap-2">
                        {categoryItems.map((item) => {
                          const checked = checkedKeys.has(item.key);
                          return (
                            <form key={item.key} action={toggleShoppingListItem}>
                              <input type="hidden" name="date" value={selectedDate} />
                              <input type="hidden" name="itemKey" value={item.key} />
                              <input type="hidden" name="checked" value={checked ? "0" : "1"} />
                              <button
                                type="submit"
                                aria-pressed={checked}
                                className={`flex min-h-16 w-full items-center gap-4 rounded-[var(--radius-md)] border px-4 py-3 text-left transition ${checked ? "border-border-subtle bg-surface-muted text-text-muted" : "border-border-strong bg-surface-primary text-text-primary"}`}
                              >
                                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${checked ? "border-forest-strong bg-forest-strong text-surface" : "border-border-strong bg-surface-raised text-transparent"}`} aria-hidden="true">
                                  ✓
                                </span>
                                <span className="min-w-0 flex-1">
                                  <span className={`block font-semibold ${checked ? "line-through" : ""}`}>{item.name}</span>
                                  <span className="mt-0.5 block text-sm text-text-muted">
                                    {formatShoppingQuantity(item.quantity, item.unit, locale)}
                                    {item.occurrences > 1 ? ` · aus ${item.occurrences} Rezepten` : ""}
                                  </span>
                                </span>
                              </button>
                            </form>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </section>

            <section className="mt-6 max-w-4xl rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised p-5" aria-labelledby="pon-transfer-heading">
              <h2 id="pon-transfer-heading" className="text-lg font-semibold text-text-primary">An Pon übergeben</h2>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Offene Positionen werden als mengenlesbare Textliste geteilt oder kopiert. Pon bietet derzeit keine öffentliche API für ein direktes, autorisiertes Schreiben aus einer Web-App.
              </p>
              <div className="mt-5">
                <ShoppingListTransfer
                  text={shoppingListTransferText(openItems, locale)}
                  weekLabel={weekLabel}
                />
              </div>
              <p className="mt-4 text-xs leading-5 text-text-muted">
                Auf dem iPhone kannst du „Liste teilen“ mit einem eigenen Kurzbefehl verbinden, der die Zeilen an Pons Kurzbefehlsaktion übergibt. Ohne Kurzbefehl kopierst du die Liste und öffnest Pon anschließend manuell.
              </p>
            </section>
          </>
        )}
      </Page>
    </AppLayout>
  );
}
