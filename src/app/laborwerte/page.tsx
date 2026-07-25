import Link from "next/link";

import { LabReportDetails } from "@/components/labs/lab-report-details";
import { LabReportDeletion } from "@/components/labs/lab-report-deletion";
import { LabReportForm } from "@/components/labs/lab-report-form";
import { LabResultForm } from "@/components/labs/lab-result-form";
import { LabTrend } from "@/components/labs/lab-trend";
import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { fastingStatusLabels } from "@/lib/labs/lab-catalog";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import {
  dateInTimeZone,
  defaultLocale,
  defaultTimeZone,
  timeInTimeZone,
} from "@/lib/user-settings";

export const dynamic = "force-dynamic";

type LaborwertePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function queryValue(
  query: Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  const value = query[name];
  return Array.isArray(value) ? value[0] : value;
}

export default async function LaborwertePage({
  searchParams,
}: LaborwertePageProps) {
  const user = await requireUser();
  const query = await searchParams;
  const [settings, reports, trendOptions] = await Promise.all([
    prisma.userSettings.findUnique({
      where: { userId: user.id },
      select: { timeZone: true, locale: true },
    }),
    prisma.labReport.findMany({
      where: { userId: user.id },
      orderBy: { collectedAt: "desc" },
      take: 20,
      include: {
        results: {
          orderBy: { analyteName: "asc" },
          include: { _count: { select: { revisions: true } } },
        },
      },
    }),
    prisma.labResult.findMany({
      where: { userId: user.id },
      distinct: ["analyteKey"],
      orderBy: { analyteName: "asc" },
      select: { analyteKey: true, analyteName: true, unit: true },
    }),
  ]);
  const timeZone = settings?.timeZone ?? defaultTimeZone;
  const locale = settings?.locale ?? defaultLocale;
  const requestedReportId = queryValue(query, "report");
  const selectedReport = reports.find(({ id }) => id === requestedReportId)
    ?? reports[0]
    ?? null;
  const requestedAnalyteKey = queryValue(query, "analyte");
  const editResultId = queryValue(query, "editResult");
  const defaultAnalyteKey = selectedReport?.results.at(0)?.analyteKey
    ?? trendOptions.at(0)?.analyteKey;
  const selectedTrendOption = trendOptions.find(
    ({ analyteKey }) => analyteKey === requestedAnalyteKey,
  ) ?? trendOptions.find(({ analyteKey }) => analyteKey === defaultAnalyteKey)
    ?? null;
  const trendResultsDescending = selectedTrendOption
    ? await prisma.labResult.findMany({
        where: {
          userId: user.id,
          analyteKey: selectedTrendOption.analyteKey,
        },
        orderBy: { measuredAt: "desc" },
        take: 24,
        select: {
          id: true,
          analyteKey: true,
          analyteName: true,
          unit: true,
          value: true,
          referenceLow: true,
          referenceHigh: true,
          measuredAt: true,
        },
      })
    : [];
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone,
  });
  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone,
  });
  const error = queryValue(query, "error");
  const errorMessage = error === "report-validation"
    ? "Bitte prüfe Datum, Uhrzeit und optionale Angaben der Untersuchung."
    : error === "result-validation"
      ? "Bitte wähle einen Laborwert und prüfe Messwert sowie Referenzbereich."
      : error === "duplicate"
        ? "Dieser Laborwert ist in der ausgewählten Untersuchung bereits erfasst."
        : error === "report-not-found"
          ? "Die Untersuchung wurde nicht gefunden oder gehört nicht zu deinem Konto."
          : error === "result-not-found"
            ? "Der Laborwert wurde nicht gefunden oder gehört nicht zu deinem Konto."
            : error === "correction-validation"
              ? "Bitte prüfe Messwert, Referenzbereich und Korrekturgrund."
              : error === "delete-validation"
                ? "Bestätige das endgültige Löschen der Untersuchung."
                : error === "analyte"
                  ? "Der ausgewählte Laborwert ist nicht verfügbar."
                  : null;
  const statusMessage = queryValue(query, "created")
    ? "Untersuchung angelegt. Jetzt kannst du die einzelnen Laborwerte ergänzen."
    : queryValue(query, "saved")
      ? "Laborwert gespeichert."
      : queryValue(query, "corrected")
        ? "Laborwert korrigiert. Der vorherige Stand wurde gespeichert."
        : queryValue(query, "deleted")
          ? "Untersuchung und zugehörige Laborwerte wurden gelöscht."
          : null;
  const now = new Date();

  return (
    <AppLayout>
      <Page>
        <header className="max-w-4xl">
          <PageTitle>Laborwerte</PageTitle>
          <PageSubtitle className="mt-4">
            Dokumentiere Ergebnisse strukturiert und verfolge ihre Entwicklung,
            ohne einzelne Messwerte medizinisch zu bewerten.
          </PageSubtitle>
        </header>

        {statusMessage ? (
          <p role="status" className="mt-8 max-w-4xl rounded-[var(--radius-md)] border border-forest-soft bg-forest-soft px-4 py-3 text-sm font-semibold text-forest-strong">{statusMessage}</p>
        ) : null}
        {errorMessage ? (
          <p role="alert" className="mt-8 max-w-4xl rounded-[var(--radius-md)] border border-danger bg-surface-raised px-4 py-3 text-sm font-semibold text-danger">{errorMessage}</p>
        ) : null}

        <section className="mt-8 max-w-4xl" aria-label="Neue Laboruntersuchung">
          <LabReportForm
            defaultDate={dateInTimeZone(now, timeZone)}
            defaultTime={timeInTimeZone(now, timeZone)}
            initiallyOpen={reports.length === 0}
          />
        </section>

        {reports.length > 0 ? (
          <section className="mt-10 w-full min-w-0 max-w-4xl" aria-labelledby="reports-heading">
            <h2 id="reports-heading" className="text-2xl font-semibold text-text-primary">Untersuchungen</h2>
            <p className="mt-1 text-sm text-text-muted">{reports.length} {reports.length === 1 ? "Untersuchung" : "Untersuchungen"}</p>
            <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-2">
              {reports.map((report) => {
                const selected = report.id === selectedReport?.id;
                return (
                  <Link
                    key={report.id}
                    href={`/laborwerte?report=${report.id}`}
                    aria-current={selected ? "true" : undefined}
                    className={`min-w-[16rem] snap-start rounded-[var(--radius-lg)] border p-4 ${selected ? "border-forest-strong bg-forest-soft" : "border-border-strong bg-surface-raised"}`}
                  >
                    <span className="block font-semibold text-text-primary">{dateFormatter.format(report.collectedAt)}</span>
                    <span className="mt-1 block text-sm text-text-secondary">{timeFormatter.format(report.collectedAt)} Uhr · {fastingStatusLabels[report.fastingStatus]}</span>
                    <span className="mt-3 block text-sm font-semibold text-forest-strong">{report.results.length} {report.results.length === 1 ? "Wert" : "Werte"}</span>
                  </Link>
                );
              })}
            </div>
          </section>
        ) : null}

        {selectedReport ? (
          <section className="mt-10 max-w-4xl" aria-label="Ausgewählte Laboruntersuchung">
            <LabReportDetails report={selectedReport} locale={locale} timeZone={timeZone} editResultId={editResultId} />
            <LabResultForm
              reportId={selectedReport.id}
              recordedAnalyteKeys={selectedReport.results.map(({ analyteKey }) => analyteKey)}
            />
            <LabReportDeletion reportId={selectedReport.id} resultCount={selectedReport.results.length} />
          </section>
        ) : null}

        {selectedTrendOption ? (
          <LabTrend
            options={trendOptions}
            selected={selectedTrendOption}
            results={trendResultsDescending.toReversed()}
            reportId={selectedReport?.id ?? null}
            locale={locale}
            timeZone={timeZone}
          />
        ) : null}

        <p className="mt-8 max-w-4xl text-sm leading-6 text-text-muted">
          Referenzbereiche unterscheiden sich je Labor und Person. LångKompass dokumentiert die übermittelten Werte und ersetzt keine medizinische Einordnung.
        </p>
      </Page>
    </AppLayout>
  );
}
