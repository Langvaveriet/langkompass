import { logSupplementNow } from "@/app/supplemente/actions";
import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { SupplementForm } from "@/components/supplements/supplement-form";
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

export default async function SupplementePage({ searchParams }: SupplementePageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const settings = await prisma.userSettings.findUnique({
    where: { userId: user.id },
    select: { timeZone: true, locale: true },
  });
  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const locale = settings?.locale ?? defaultLocale;
  const [supplements, recentIntakes] = await Promise.all([
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
  const error = queryValue(query, "error");
  const errorMessage = error === "validation"
    ? "Bitte prüfe Produkt, Standarddosis, Grund und Hauptwirkstoff."
    : error === "duplicate"
      ? "Ein aktives Supplement mit diesem Namen ist bereits vorhanden."
      : error === "intake-validation"
        ? "Bitte prüfe Zeitpunkt und Einnahmemenge."
        : error === "not-found"
          ? "Das Supplement wurde nicht gefunden oder gehört nicht zu deinem Konto."
          : null;
  const statusMessage = queryValue(query, "created")
    ? "Supplement gespeichert."
    : queryValue(query, "taken")
      ? "Einnahme dokumentiert."
      : null;

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
          <h2 id="active-supplements-heading" className="text-2xl font-semibold text-text-primary">Aktuelle Supplemente</h2>
          <p className="mt-1 text-sm text-text-muted">{supplements.length} {supplements.length === 1 ? "aktives Präparat" : "aktive Präparate"}</p>

          {supplements.length > 0 ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {supplements.map((supplement) => (
                <article key={supplement.id} className="rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised p-5">
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
