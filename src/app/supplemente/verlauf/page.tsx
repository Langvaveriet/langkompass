import Link from "next/link";

import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { SupplementIntakeChart } from "@/components/supplements/supplement-intake-chart";
import { SupplementIntakeCorrectionForm } from "@/components/supplements/supplement-intake-correction-form";
import { SupplementIntakeDeletion } from "@/components/supplements/supplement-intake-deletion";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  buildDailyIntakeCounts,
  supplementHistoryPeriodLabels,
  supplementHistoryPeriods,
  summarizeSupplementIntakes,
  type SupplementHistoryPeriod,
} from "@/lib/supplements/intake-history";
import {
  supplementDoseUnitLabel,
  supplementEffectLabels,
  supplementToleranceLabels,
} from "@/lib/supplements/supplement-options";
import {
  dateInTimeZone,
  defaultLocale,
  defaultTimeZone,
  localDateTimeToUtc,
  timeInTimeZone,
} from "@/lib/user-settings";

export const dynamic = "force-dynamic";

type SupplementHistoryPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function queryValue(query: Record<string, string | string[] | undefined>, name: string): string | undefined {
  const value = query[name];
  return Array.isArray(value) ? value[0] : value;
}

function addIsoDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00.000Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

function historyHref(period: SupplementHistoryPeriod, supplementId: string | null, editId?: string): string {
  const params = new URLSearchParams({ period });
  if (supplementId) params.set("supplement", supplementId);
  if (editId) params.set("edit", editId);
  return `/supplemente/verlauf?${params.toString()}`;
}

export default async function SupplementHistoryPage({ searchParams }: SupplementHistoryPageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const [settings, supplements] = await Promise.all([
    prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: { timeZone: true, locale: true },
    }),
    prisma.supplement.findMany({
      where: { userId: user.id },
      orderBy: [{ archivedAt: "asc" }, { name: "asc" }],
      select: { id: true, name: true, archivedAt: true },
    }),
  ]);
  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const locale = settings?.locale ?? defaultLocale;
  const requestedPeriod = queryValue(query, "period");
  const period: SupplementHistoryPeriod = supplementHistoryPeriods.includes(
    requestedPeriod as SupplementHistoryPeriod,
  ) ? requestedPeriod as SupplementHistoryPeriod : "30";
  const requestedSupplementId = queryValue(query, "supplement");
  const selectedSupplementId = supplements.some(({ id }) => id === requestedSupplementId)
    ? requestedSupplementId ?? null
    : null;
  const today = dateInTimeZone(new Date(), timeZone);
  const periodDays = period === "all" ? null : Number(period);
  const periodStartDate = periodDays ? addIsoDays(today, -(periodDays - 1)) : null;
  const periodStart = periodStartDate
    ? localDateTimeToUtc(periodStartDate, "00:00", timeZone)
    : null;
  const intakes = await prisma.supplementIntake.findMany({
    where: {
      userId: user.id,
      supplementId: selectedSupplementId ?? undefined,
      takenAt: periodStart ? { gte: periodStart } : undefined,
    },
    orderBy: { takenAt: "desc" },
    take: 500,
    include: {
      supplement: { select: { id: true, name: true, archivedAt: true } },
      _count: { select: { revisions: true } },
    },
  });
  const summary = summarizeSupplementIntakes(
    intakes,
    (date) => dateInTimeZone(date, timeZone),
  );
  const chartDayCount = Math.min(periodDays ?? 30, 30);
  const chartKeys = Array.from(
    { length: chartDayCount },
    (_, index) => addIsoDays(today, index - chartDayCount + 1),
  );
  const chartLabelFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });
  const chartDays = buildDailyIntakeCounts(
    intakes,
    chartKeys,
    (date) => dateInTimeZone(date, timeZone),
  ).map((day) => ({
    ...day,
    label: chartLabelFormatter.format(new Date(`${day.key}T00:00:00.000Z`)),
  }));
  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
  const numberFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 2 });
  const editId = queryValue(query, "edit");
  const error = queryValue(query, "error");
  const errorMessage = error === "correction-validation"
    ? "Bitte prüfe Zeitpunkt, Menge, Einheit und Korrekturgrund."
    : error === "delete-validation"
      ? "Bitte bestätige das endgültige Löschen der Einnahme."
      : error === "intake-not-found"
        ? "Die Einnahme wurde nicht gefunden oder gehört nicht zu deinem Konto."
        : null;
  const statusMessage = queryValue(query, "corrected")
    ? "Einnahme korrigiert. Der vorherige Stand wurde gespeichert."
    : queryValue(query, "deleted")
      ? "Einnahme gelöscht."
      : null;

  return (
    <AppLayout>
      <Page>
        <header className="max-w-5xl">
          <Link href="/supplemente" className="inline-flex min-h-11 items-center text-sm font-semibold text-forest-strong">← Supplemente</Link>
          <PageTitle className="mt-3">Einnahmeverlauf</PageTitle>
          <PageSubtitle className="mt-4">Dokumentierte Einnahmen, Verträglichkeit und eigene Beobachtungen im gewählten Zeitraum.</PageSubtitle>
        </header>

        {statusMessage ? <p role="status" className="mt-8 max-w-5xl rounded-[var(--radius-md)] border border-forest-soft bg-forest-soft px-4 py-3 text-sm font-semibold text-forest-strong">{statusMessage}</p> : null}
        {errorMessage ? <p role="alert" className="mt-8 max-w-5xl rounded-[var(--radius-md)] border border-danger bg-surface-raised px-4 py-3 text-sm font-semibold text-danger">{errorMessage}</p> : null}

        <section className="mt-8 max-w-5xl" aria-labelledby="history-filter-heading">
          <h2 id="history-filter-heading" className="text-sm font-semibold text-text-primary">Zeitraum</h2>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-2" aria-label="Zeitraum auswählen">
            {supplementHistoryPeriods.map((option) => (
              <Link key={option} href={historyHref(option, selectedSupplementId)} aria-current={period === option ? "page" : undefined} className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold ${period === option ? "border-forest-strong bg-forest-soft text-forest-strong" : "border-border-strong bg-surface-raised text-text-primary"}`}>
                {supplementHistoryPeriodLabels[option]}
              </Link>
            ))}
          </nav>
          <h2 className="mt-4 text-sm font-semibold text-text-primary">Präparat</h2>
          <nav className="mt-3 flex gap-2 overflow-x-auto pb-2" aria-label="Supplement auswählen">
            <Link href={historyHref(period, null)} aria-current={selectedSupplementId === null ? "page" : undefined} className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold ${selectedSupplementId === null ? "border-forest-strong bg-forest-soft text-forest-strong" : "border-border-strong bg-surface-raised text-text-primary"}`}>Alle</Link>
            {supplements.map((supplement) => (
              <Link key={supplement.id} href={historyHref(period, supplement.id)} aria-current={selectedSupplementId === supplement.id ? "page" : undefined} className={`inline-flex min-h-11 shrink-0 items-center rounded-full border px-4 py-2 text-sm font-semibold ${selectedSupplementId === supplement.id ? "border-forest-strong bg-forest-soft text-forest-strong" : "border-border-strong bg-surface-raised text-text-primary"}`}>
                {supplement.name}{supplement.archivedAt ? " · archiviert" : ""}
              </Link>
            ))}
          </nav>
        </section>

        <section className="mt-8 max-w-5xl rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised p-5 sm:p-6" aria-labelledby="history-summary-heading">
          <p className="text-sm font-semibold text-copper">{supplementHistoryPeriodLabels[period]}</p>
          <h2 id="history-summary-heading" className="mt-1 text-2xl font-semibold text-text-primary">Dokumentierte Einnahmen</h2>
          <dl className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
            <div className="rounded-[var(--radius-md)] bg-surface p-4"><dt className="text-xs text-text-muted">Einnahmen</dt><dd className="mt-1 text-xl font-semibold text-text-primary">{summary.intakeCount}</dd></div>
            <div className="rounded-[var(--radius-md)] bg-surface p-4"><dt className="text-xs text-text-muted">Erfasste Tage</dt><dd className="mt-1 text-xl font-semibold text-text-primary">{summary.recordedDays}</dd></div>
            <div className="rounded-[var(--radius-md)] bg-surface p-4"><dt className="text-xs text-text-muted">Gut vertragen</dt><dd className="mt-1 text-xl font-semibold text-forest-strong">{summary.wellToleratedCount}</dd></div>
            <div className="rounded-[var(--radius-md)] bg-surface p-4"><dt className="text-xs text-text-muted">Mögliche Reaktion</dt><dd className="mt-1 text-xl font-semibold text-copper">{summary.possibleReactionCount}</dd></div>
            <div className="col-span-2 rounded-[var(--radius-md)] bg-surface p-4 sm:col-span-1"><dt className="text-xs text-text-muted">Positiv bemerkt</dt><dd className="mt-1 text-xl font-semibold text-text-primary">{summary.positiveEffectCount}</dd></div>
          </dl>
          <SupplementIntakeChart days={chartDays} />
          <p className="mt-3 text-xs leading-5 text-text-muted">Die Balken zeigen ausschließlich gespeicherte Einnahmen der letzten {chartDayCount} Tage. Fehlende Einträge sind keine Aussage darüber, ob ein Präparat tatsächlich eingenommen wurde.</p>
        </section>

        <section className="mt-10 max-w-5xl" aria-labelledby="intake-list-heading">
          <h2 id="intake-list-heading" className="text-2xl font-semibold text-text-primary">Einzelne Einnahmen</h2>
          <p className="mt-1 text-sm text-text-muted">{intakes.length}{intakes.length === 500 ? "+" : ""} Einträge im gewählten Filter</p>
          {intakes.length > 0 ? (
            <div className="mt-5 grid gap-3">
              {intakes.map((intake) => {
                const editing = editId === intake.id;
                return (
                  <article key={intake.id} className={`rounded-[var(--radius-lg)] border bg-surface-raised p-4 ${editing ? "border-copper" : "border-border"}`}>
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-text-primary">{intake.supplement.name}{intake.supplement.archivedAt ? " · archiviert" : ""}</h3>
                        <p className="mt-1 text-sm text-text-secondary">{dateTimeFormatter.format(intake.takenAt)} Uhr · {numberFormatter.format(Number(intake.dose))} {supplementDoseUnitLabel(intake.doseUnit, Number(intake.dose))}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs font-semibold">
                        {intake.tolerance !== "NOT_RATED" ? <span className="rounded-full bg-forest-soft px-3 py-1 text-forest-strong">{supplementToleranceLabels[intake.tolerance]}</span> : null}
                        {intake.effect !== "NOT_RATED" ? <span className="rounded-full bg-copper-soft px-3 py-1 text-copper">{supplementEffectLabels[intake.effect]}</span> : null}
                      </div>
                    </div>
                    {intake.note ? <p className="mt-3 text-sm leading-6 text-text-muted">{intake.note}</p> : null}
                    {intake._count.revisions > 0 ? <p className="mt-2 text-xs font-semibold text-copper">{intake._count.revisions} {intake._count.revisions === 1 ? "frühere Version" : "frühere Versionen"} gespeichert</p> : null}
                    <div className="mt-3 flex flex-wrap gap-3">
                      <Link href={editing ? historyHref(period, selectedSupplementId) : historyHref(period, selectedSupplementId, intake.id)} className="inline-flex min-h-11 items-center text-sm font-semibold text-forest-strong">{editing ? "Korrektur schließen" : "Einnahme korrigieren"}</Link>
                    </div>
                    {editing ? (
                      <SupplementIntakeCorrectionForm
                        intake={intake}
                        takenDate={dateInTimeZone(intake.takenAt, timeZone)}
                        takenTime={timeInTimeZone(intake.takenAt, timeZone)}
                        returnPeriod={period}
                        returnSupplementId={selectedSupplementId}
                      />
                    ) : null}
                    <SupplementIntakeDeletion intakeId={intake.id} returnPeriod={period} returnSupplementId={selectedSupplementId} />
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="mt-5 rounded-[var(--radius-lg)] border border-border bg-surface-raised p-5">
              <p className="font-semibold text-text-primary">Keine Einnahmen in diesem Filter.</p>
              <p className="mt-2 text-sm leading-6 text-text-muted">Wähle einen längeren Zeitraum oder dokumentiere die nächste Einnahme im Supplementbereich.</p>
            </div>
          )}
        </section>

        <p className="mt-8 max-w-5xl text-sm leading-6 text-text-muted">Die Darstellung beschreibt ausschließlich deine dokumentierten Angaben und bewertet weder Wirksamkeit noch medizinisch empfohlene Regelmäßigkeit.</p>
      </Page>
    </AppLayout>
  );
}
