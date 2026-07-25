import Link from "next/link";

import { logSupplementNow, setSupplementArchived } from "@/app/supplemente/actions";
import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { SupplementForm } from "@/components/supplements/supplement-form";
import { SupplementEditForm } from "@/components/supplements/supplement-edit-form";
import { SupplementIngredients } from "@/components/supplements/supplement-ingredients";
import { SupplementIntakeForm } from "@/components/supplements/supplement-intake-form";
import { Button } from "@/components/ui/button";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  supplementDoseUnitLabel,
  supplementEffectLabels,
  supplementFormLabels,
  supplementIngredientUnitLabels,
  supplementReasonLabels,
  supplementToleranceLabels,
} from "@/lib/supplements/supplement-options";
import {
  dateInTimeZone,
  defaultLocale,
  defaultTimeZone,
  timeInTimeZone,
} from "@/lib/user-settings";

export const dynamic = "force-dynamic";

type SupplementePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function queryValue(query: Record<string, string | string[] | undefined>, name: string): string | undefined {
  const value = query[name];
  return Array.isArray(value) ? value[0] : value;
}

function supplementErrorMessage(error: string | undefined): string | null {
  switch (error) {
    case "validation":
      return "Bitte prüfe Produkt, Standarddosis, Grund und Hauptwirkstoff.";
    case "duplicate":
      return "Ein aktives Supplement mit diesem Namen ist bereits vorhanden.";
    case "archived-exists":
      return "Ein archiviertes Supplement mit diesem Namen ist bereits vorhanden. Du kannst es unten wiederherstellen.";
    case "product-validation":
      return "Bitte prüfe Produktname, Standarddosis, Form und Einnahmegrund.";
    case "ingredient-validation":
      return "Bitte prüfe Wirkstoff, Mengen und Einheit.";
    case "ingredient-duplicate":
      return "Dieser Wirkstoff ist im Präparat bereits vorhanden.";
    case "ingredient-not-found":
      return "Der Wirkstoff wurde nicht gefunden oder gehört nicht zu diesem Präparat.";
    case "ingredient-delete-validation":
      return "Bitte bestätige das Löschen des Wirkstoffs.";
    case "last-ingredient":
      return "Der letzte Wirkstoff kann nicht gelöscht werden. Ergänze zuerst einen weiteren Wirkstoff.";
    case "archive-validation":
      return "Bitte bestätige das Archivieren des Präparats.";
    case "intake-validation":
      return "Bitte prüfe Zeitpunkt und Einnahmemenge.";
    case "not-found":
      return "Das Supplement wurde nicht gefunden oder gehört nicht zu deinem Konto.";
    default:
      return null;
  }
}

function supplementStatusMessage(query: Record<string, string | string[] | undefined>): string | null {
  if (queryValue(query, "created")) return "Supplement gespeichert.";
  if (queryValue(query, "taken")) return "Einnahme dokumentiert.";
  if (queryValue(query, "updated")) return "Präparat aktualisiert.";
  if (queryValue(query, "ingredientSaved")) return "Wirkstoff gespeichert.";
  if (queryValue(query, "ingredientDeleted")) return "Wirkstoff gelöscht.";
  if (queryValue(query, "archived")) return "Präparat archiviert. Die Einnahmehistorie bleibt erhalten.";
  if (queryValue(query, "restored")) return "Präparat wiederhergestellt.";
  return null;
}

export default async function SupplementePage({ searchParams }: SupplementePageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
    select: { timeZone: true, locale: true },
  });
  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const locale = settings?.locale ?? defaultLocale;
  const [supplements, archivedSupplements, recentIntakes] = await Promise.all([
    prisma.supplement.findMany({
      where: { userId: user.id, archivedAt: null },
      orderBy: { name: "asc" },
      include: {
        ingredients: { orderBy: { name: "asc" } },
        intakes: {
          orderBy: { takenAt: "desc" },
          take: 1,
          select: { takenAt: true },
        },
      },
    }),
    prisma.supplement.findMany({
      where: { userId: user.id, archivedAt: { not: null } },
      orderBy: { archivedAt: "desc" },
      select: {
        id: true,
        name: true,
        brand: true,
        archivedAt: true,
        _count: { select: { intakes: true } },
      },
    }),
    prisma.supplementIntake.findMany({
      where: { userId: user.id },
      orderBy: { takenAt: "desc" },
      take: 20,
      include: { supplement: { select: { name: true } } },
    }),
  ]);
  const now = new Date();
  const defaultDate = dateInTimeZone(now, timeZone);
  const defaultTime = timeInTimeZone(now, timeZone);
  const numberFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 3 });
  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
  const errorMessage = supplementErrorMessage(queryValue(query, "error"));
  const statusMessage = supplementStatusMessage(query);

  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <PageTitle>Supplemente</PageTitle>
          <PageSubtitle className="mt-4">
            Produkte, Wirkstoffe, Dosierung und Verträglichkeit strukturiert dokumentieren.
          </PageSubtitle>
        </header>

        {statusMessage ? (
          <p role="status" className="mt-8 max-w-4xl rounded-[var(--radius-md)] border border-forest-soft bg-forest-soft px-4 py-3 text-sm font-semibold text-forest-strong">{statusMessage}</p>
        ) : null}
        {errorMessage ? (
          <p role="alert" className="mt-8 max-w-4xl rounded-[var(--radius-md)] border border-danger bg-surface-raised px-4 py-3 text-sm font-semibold text-danger">{errorMessage}</p>
        ) : null}

        <section className="mt-8 max-w-4xl" aria-label="Supplement hinzufügen">
          <SupplementForm initiallyOpen={supplements.length === 0} />
        </section>

        <section className="mt-10 max-w-4xl" aria-labelledby="active-supplements-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="active-supplements-heading" className="text-2xl font-semibold text-text-primary">Aktuelle Supplemente</h2>
            <Link href="/supplemente/verlauf" className="inline-flex min-h-11 items-center text-sm font-semibold text-forest-strong">Einnahmeverlauf öffnen →</Link>
          </div>
          <p className="mt-1 text-sm text-text-muted">{supplements.length} {supplements.length === 1 ? "aktives Präparat" : "aktive Präparate"}</p>

          {supplements.length > 0 ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {supplements.map((supplement) => (
                <article id={`supplement-${supplement.id}`} key={supplement.id} className="rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary">{supplement.name}</h3>
                      <p className="mt-1 text-sm text-text-secondary">
                        {supplement.brand ? `${supplement.brand} · ` : ""}{supplementFormLabels[supplement.form]}
                      </p>
                    </div>
                    <span className="rounded-full bg-forest-soft px-3 py-1 text-xs font-semibold text-forest-strong">
                      {supplementReasonLabels[supplement.reason]}
                    </span>
                  </div>

                  <p className="mt-4 text-lg font-semibold text-text-primary">
                    {numberFormatter.format(Number(supplement.defaultDose))} {supplementDoseUnitLabel(supplement.doseUnit, Number(supplement.defaultDose))}
                  </p>
                  {supplement.ingredients.map((ingredient) => (
                    <p key={ingredient.id} className="mt-2 text-sm leading-6 text-text-secondary">
                      <strong className="text-text-primary">{ingredient.name}</strong>
                      {ingredient.amount && ingredient.unit
                        ? ` · ${numberFormatter.format(Number(ingredient.amount))} ${supplementIngredientUnitLabels[ingredient.unit]}`
                        : ""}
                      {ingredient.elementalAmount && ingredient.unit
                        ? ` · davon ${numberFormatter.format(Number(ingredient.elementalAmount))} ${supplementIngredientUnitLabels[ingredient.unit]} elementar`
                        : ""}
                    </p>
                  ))}
                  <SupplementIngredients supplementId={supplement.id} ingredients={supplement.ingredients} />
                  {supplement.intakes[0] ? (
                    <p className="mt-3 text-xs font-semibold text-copper">Zuletzt: {dateTimeFormatter.format(supplement.intakes[0].takenAt)} Uhr</p>
                  ) : (
                    <p className="mt-3 text-xs text-text-muted">Noch keine Einnahme dokumentiert</p>
                  )}

                  <form action={logSupplementNow} className="mt-5">
                    <input type="hidden" name="supplementId" value={supplement.id} />
                    <Button type="submit" size="lg" className="w-full">Jetzt eingenommen</Button>
                  </form>

                  <details className="mt-3 rounded-[var(--radius-md)] border border-border bg-surface">
                    <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold text-forest-strong marker:hidden">
                      <span>Genauer dokumentieren</span>
                      <span aria-hidden="true">›</span>
                    </summary>
                    <SupplementIntakeForm
                      supplementId={supplement.id}
                      defaultDose={supplement.defaultDose.toString()}
                      defaultDate={defaultDate}
                      defaultTime={defaultTime}
                    />
                  </details>
                  <SupplementEditForm supplement={supplement} />
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-[var(--radius-lg)] border border-border bg-surface-raised p-5">
              <p className="font-semibold text-text-primary">Noch keine Supplemente angelegt.</p>
              <p className="mt-2 text-sm leading-6 text-text-muted">Lege zuerst dein Präparat mit der üblichen Einnahmemenge an. Danach genügt für die tägliche Dokumentation ein Fingertipp.</p>
            </div>
          )}
        </section>

        {archivedSupplements.length > 0 ? (
          <section className="mt-8 max-w-4xl" aria-labelledby="archived-supplements-heading">
            <details className="rounded-[var(--radius-lg)] border border-border bg-surface-raised">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-text-secondary marker:hidden">
                <span id="archived-supplements-heading">Archivierte Präparate · {archivedSupplements.length}</span>
                <span aria-hidden="true">›</span>
              </summary>
              <div className="grid gap-3 border-t border-border p-4">
                {archivedSupplements.map((supplement) => (
                  <article key={supplement.id} className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-surface p-4">
                    <div>
                      <h3 className="font-semibold text-text-primary">{supplement.name}</h3>
                      <p className="mt-1 text-xs text-text-muted">
                        {supplement.brand ? `${supplement.brand} · ` : ""}{supplement._count.intakes} {supplement._count.intakes === 1 ? "Einnahme" : "Einnahmen"} gespeichert
                      </p>
                    </div>
                    <form action={setSupplementArchived}>
                      <input type="hidden" name="supplementId" value={supplement.id} />
                      <input type="hidden" name="intent" value="restore" />
                      <button type="submit" className="inline-flex min-h-11 items-center rounded-[var(--radius-md)] border border-border-strong px-4 py-2 text-sm font-semibold text-forest-strong">Wiederherstellen</button>
                    </form>
                  </article>
                ))}
              </div>
            </details>
          </section>
        ) : null}

        {recentIntakes.length > 0 ? (
          <section className="mt-10 max-w-4xl" aria-labelledby="recent-intakes-heading">
            <h2 id="recent-intakes-heading" className="text-2xl font-semibold text-text-primary">Letzte Einnahmen</h2>
            <div className="mt-5 grid gap-3">
              {recentIntakes.map((intake) => (
                <article key={intake.id} className="flex flex-wrap items-start justify-between gap-3 rounded-[var(--radius-lg)] border border-border bg-surface-raised p-4">
                  <div>
                    <h3 className="font-semibold text-text-primary">{intake.supplement.name}</h3>
                    <p className="mt-1 text-sm text-text-secondary">{dateTimeFormatter.format(intake.takenAt)} Uhr · {numberFormatter.format(Number(intake.dose))} {supplementDoseUnitLabel(intake.doseUnit, Number(intake.dose))}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold">
                    {intake.tolerance !== "NOT_RATED" ? <span className="rounded-full bg-forest-soft px-3 py-1 text-forest-strong">{supplementToleranceLabels[intake.tolerance]}</span> : null}
                    {intake.effect !== "NOT_RATED" ? <span className="rounded-full bg-copper-soft px-3 py-1 text-copper">{supplementEffectLabels[intake.effect]}</span> : null}
                  </div>
                  {intake.note ? <p className="w-full text-sm leading-6 text-text-muted">{intake.note}</p> : null}
                </article>
              ))}
            </div>
          </section>
        ) : null}

        <p className="mt-8 max-w-4xl text-sm leading-6 text-text-muted">
          LångKompass dokumentiert deine Angaben. Es empfiehlt keine Dosierungen und ersetzt keine medizinische oder pharmazeutische Beratung.
        </p>
      </Page>
    </AppLayout>
  );
}
