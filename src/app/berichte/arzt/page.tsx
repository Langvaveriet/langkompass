import Link from "next/link";

import { AppLayout } from "@/components/layout/app-layout";
import { Page } from "@/components/layout/page";
import { PrintReportButton } from "@/components/reports/print-report-button";
import { PageSubtitle, PageTitle } from "@/components/ui/typography";
import { loadHealthContext } from "@/lib/compass/load-health-context";
import { localStructuredProvider } from "@/lib/compass/local-provider";
import {
  analyzeWithCompassProvider,
  createCompassAnalysisRequest,
} from "@/lib/compass/provider";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";

export const dynamic = "force-dynamic";

function numberLabel(value: number | null, suffix = "") {
  return value === null
    ? "Nicht dokumentiert"
    : `${value.toLocaleString("de-DE")}${suffix}`;
}

function dateLabel(value: string | Date, timeZone: string) {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).format(new Date(value));
}

function rangeLabel(
  low: number | null,
  high: number | null,
  unit: string,
) {
  if (low !== null && high !== null) return `${low.toLocaleString("de-DE")}–${high.toLocaleString("de-DE")} ${unit}`;
  if (low !== null) return `ab ${low.toLocaleString("de-DE")} ${unit}`;
  if (high !== null) return `bis ${high.toLocaleString("de-DE")} ${unit}`;
  return null;
}

export default async function PhysicianReportPage() {
  const user = await requireUser();
  const [context, profile] = await Promise.all([
    loadHealthContext(user.id, new Date(), 365),
    prisma.healthProfile.findUnique({
      where: { userId: user.id },
      select: { firstName: true, lastName: true, dateOfBirth: true },
    }),
  ]);
  const response = await analyzeWithCompassProvider(
    localStructuredProvider,
    createCompassAnalysisRequest(context),
    { allowExternalTransfer: false },
  );
  const observations = context.observations;
  const displayName = [profile?.firstName, profile?.lastName]
    .filter(Boolean)
    .join(" ") || user.name || "LångKompass-Benutzer";
  const periodEnd = new Date(new Date(context.period.toExclusive).getTime() - 1);

  return (
    <AppLayout>
      <Page className="print-report max-w-5xl">
        <div className="print-hidden mb-8 flex flex-wrap items-center justify-between gap-3">
          <Link href="/compass-ai" className="text-sm font-semibold text-forest-strong">
            ← Zurück zu Compass
          </Link>
          <PrintReportButton />
        </div>

        <header className="border-b border-border-strong pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-copper">
            Persönliche Gesundheitsübersicht
          </p>
          <PageTitle className="mt-2">Arztbericht</PageTitle>
          <PageSubtitle className="mt-4">
            Strukturierte Selbstdokumentation aus LångKompass – keine Diagnose
            und kein Ersatz für eine medizinische Beurteilung.
          </PageSubtitle>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div><dt className="text-xs text-text-muted">Name</dt><dd className="mt-1 font-semibold">{displayName}</dd></div>
            <div><dt className="text-xs text-text-muted">Geburtsdatum</dt><dd className="mt-1 font-semibold">{profile?.dateOfBirth ? dateLabel(profile.dateOfBirth, "UTC") : "Nicht hinterlegt"}</dd></div>
            <div><dt className="text-xs text-text-muted">Zeitraum</dt><dd className="mt-1 font-semibold">{dateLabel(context.period.from, context.period.timeZone)}–{dateLabel(periodEnd, context.period.timeZone)}</dd></div>
            <div><dt className="text-xs text-text-muted">Erstellt</dt><dd className="mt-1 font-semibold">{dateLabel(context.generatedAt, context.period.timeZone)}</dd></div>
          </dl>
        </header>

        <section className="mt-8" aria-labelledby="report-coverage">
          <h2 id="report-coverage" className="text-2xl font-semibold">Datengrundlage</h2>
          <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Tageserfassungen", context.coverage.dailyEntryCount],
              ["Mahlzeiteneinträge", context.coverage.recordedMealItemCount],
              ["Trainings", context.coverage.completedTrainingSessionCount],
              ["Laborparameter", context.coverage.latestLabAnalyteCount],
            ].map(([label, value]) => (
              <div key={label} className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                <dt className="text-xs text-text-muted">{label}</dt>
                <dd className="mt-1 text-xl font-semibold">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-8" aria-labelledby="report-observations">
          <h2 id="report-observations" className="text-2xl font-semibold">Dokumentierte Beobachtungen</h2>
          {response.statements.length > 0 ? (
            <ul className="mt-4 grid gap-3">
              {response.statements.map((statement) => (
                <li key={`${statement.category}-${statement.text}`} className="rounded-[var(--radius-md)] border border-border-subtle p-4 text-sm leading-6">
                  {statement.text}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-text-muted">Für eine zusammenfassende Beobachtung liegen noch nicht genügend Daten vor.</p>
          )}
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-2" aria-label="Alltags- und Körperwerte">
          <div className="rounded-[var(--radius-lg)] border border-border-subtle p-5">
            <h2 className="text-xl font-semibold">Alltag</h2>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-4"><dt>Ø Schlaf</dt><dd className="font-semibold">{numberLabel(observations.dailyCheckIns.averageSleepHours, " Std.")}</dd></div>
              <div className="flex justify-between gap-4"><dt>Ø Energie</dt><dd className="font-semibold">{numberLabel(observations.dailyCheckIns.averageEnergy, " / 10")}</dd></div>
              <div className="flex justify-between gap-4"><dt>Ø Stimmung</dt><dd className="font-semibold">{numberLabel(observations.dailyCheckIns.averageMood, " / 10")}</dd></div>
              <div className="flex justify-between gap-4"><dt>Ø Schritte</dt><dd className="font-semibold">{numberLabel(observations.dailyCheckIns.averageSteps)}</dd></div>
              <div className="flex justify-between gap-4"><dt>Ø aktive Zeit</dt><dd className="font-semibold">{numberLabel(observations.dailyCheckIns.averageActiveMinutes, " Min.")}</dd></div>
            </dl>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-border-subtle p-5">
            <h2 className="text-xl font-semibold">Körper und Aktivität</h2>
            <dl className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-4"><dt>Letztes Gewicht</dt><dd className="font-semibold">{numberLabel(observations.body.latestWeightKg, " kg")}</dd></div>
              <div className="flex justify-between gap-4"><dt>Gewichtsveränderung</dt><dd className="font-semibold">{numberLabel(observations.body.weightChangeKg, " kg")}</dd></div>
              <div className="flex justify-between gap-4"><dt>Letzter Bauchumfang</dt><dd className="font-semibold">{numberLabel(observations.body.latestWaistCm, " cm")}</dd></div>
              <div className="flex justify-between gap-4"><dt>Abgeschlossene Trainings</dt><dd className="font-semibold">{observations.training.completedSessionCount}</dd></div>
              <div className="flex justify-between gap-4"><dt>Dokumentierte Sätze</dt><dd className="font-semibold">{observations.training.documentedSetCount}</dd></div>
            </dl>
          </div>
        </section>

        <section className="mt-8" aria-labelledby="report-labs">
          <h2 id="report-labs" className="text-2xl font-semibold">Neueste Laborwerte</h2>
          {observations.laboratory.latestResults.length > 0 ? (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {observations.laboratory.latestResults.map((result) => (
                <li key={result.analyteKey} className="flex items-start justify-between gap-4 rounded-[var(--radius-md)] bg-surface-muted p-4 text-sm">
                  <span>
                    <strong className="block">{result.analyteName}</strong>
                    <span className="text-xs text-text-muted">{dateLabel(result.measuredAt, context.period.timeZone)}</span>
                    {rangeLabel(result.referenceLow, result.referenceHigh, result.unit) ? <span className="mt-1 block text-xs text-text-muted">Referenz: {rangeLabel(result.referenceLow, result.referenceHigh, result.unit)}</span> : null}
                    {rangeLabel(result.targetLow, result.targetHigh, result.unit) ? <span className="mt-1 block text-xs text-text-muted">Persönliches Ziel: {rangeLabel(result.targetLow, result.targetHigh, result.unit)}</span> : null}
                  </span>
                  <span className="text-right font-semibold">{result.value.toLocaleString("de-DE")} {result.unit}</span>
                </li>
              ))}
            </ul>
          ) : <p className="mt-4 text-text-muted">Keine Laborwerte dokumentiert.</p>}
        </section>

        <section className="mt-8" aria-labelledby="report-supplements">
          <h2 id="report-supplements" className="text-2xl font-semibold">Aktive Supplemente</h2>
          {observations.supplements.active.length > 0 ? (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {observations.supplements.active.map((supplement) => (
                <li key={supplement.name} className="rounded-[var(--radius-md)] border border-border-subtle p-4 text-sm">
                  <strong>{supplement.name}</strong>
                  {supplement.ingredients.length > 0 ? <span className="mt-1 block text-text-muted">{supplement.ingredients.join(", ")}</span> : null}
                </li>
              ))}
            </ul>
          ) : <p className="mt-4 text-text-muted">Keine aktiven Supplemente dokumentiert.</p>}
        </section>

        {context.dataGaps.length > 0 ? (
          <section className="mt-8 border-t border-border-subtle pt-5 text-sm text-text-muted" aria-labelledby="report-gaps">
            <h2 id="report-gaps" className="font-semibold text-text-primary">Hinweise zur Datenabdeckung</h2>
            <ul className="mt-2 grid gap-1">{context.dataGaps.map((gap) => <li key={gap}>• {gap}</li>)}</ul>
          </section>
        ) : null}
      </Page>
    </AppLayout>
  );
}
