import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HealthContext } from "@/lib/compass/health-context";

type HealthContextPreviewProps = {
  context: HealthContext;
};

function metric(value: number | null, suffix = ""): string {
  return value === null ? "Noch keine Daten" : `${value.toLocaleString("de-DE")}${suffix}`;
}

function dateLabel(value: string, timeZone: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  }).format(new Date(value));
}

export function HealthContextPreview({ context }: HealthContextPreviewProps) {
  const { coverage, observations } = context;
  const periodLabel = `${dateLabel(context.period.from, context.period.timeZone)} bis ${dateLabel(new Date(new Date(context.period.toExclusive).getTime() - 1).toISOString(), context.period.timeZone)}`;

  return (
    <div className="mt-8 grid gap-6">
      <section className="rounded-[var(--radius-xl)] border border-forest-soft bg-forest-soft p-5 sm:p-6" aria-labelledby="context-status-heading">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-forest-strong">Lokaler Datenkontext</p>
        <h2 id="context-status-heading" className="mt-2 text-2xl font-semibold text-text-primary">Bereit für eine nachvollziehbare Einordnung</h2>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-text-secondary">
          Der Kontext wurde ausschließlich auf deinem Server erzeugt. Es wurden keine Daten an OpenAI oder einen anderen KI-Anbieter übertragen.
        </p>
        <dl className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] bg-surface-raised p-4">
            <dt className="text-xs text-text-muted">Zeitraum</dt>
            <dd className="mt-1 font-semibold text-text-primary">{periodLabel}</dd>
          </div>
          <div className="rounded-[var(--radius-md)] bg-surface-raised p-4">
            <dt className="text-xs text-text-muted">Schema</dt>
            <dd className="mt-1 font-semibold text-text-primary">{context.schemaVersion}</dd>
          </div>
          <div className="rounded-[var(--radius-md)] bg-surface-raised p-4">
            <dt className="text-xs text-text-muted">Freitext</dt>
            <dd className="mt-1 font-semibold text-text-primary">Nicht enthalten</dd>
          </div>
        </dl>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Datenabdeckung">
        {[
          ["Tageserfassungen", `${coverage.dailyEntryCount} von ${context.period.days} Tagen`],
          ["Mahlzeiteneinträge", coverage.recordedMealItemCount.toLocaleString("de-DE")],
          ["Trainings", coverage.completedTrainingSessionCount.toLocaleString("de-DE")],
          ["Laborparameter", coverage.latestLabAnalyteCount.toLocaleString("de-DE")],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised p-5 shadow-sm">
            <p className="text-xs text-text-muted">{label}</p>
            <p className="mt-2 text-xl font-semibold text-text-primary">{value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-2" aria-label="Strukturierte Beobachtungen">
        <Card>
          <CardHeader><CardTitle>Alltag und Körper</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Ø Schlaf</dt><dd className="mt-1 font-semibold text-text-primary">{metric(observations.dailyCheckIns.averageSleepHours, " Std.")}</dd></div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Ø Energie</dt><dd className="mt-1 font-semibold text-text-primary">{metric(observations.dailyCheckIns.averageEnergy, " / 10")}</dd></div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Letztes Gewicht</dt><dd className="mt-1 font-semibold text-text-primary">{metric(observations.body.latestWeightKg, " kg")}</dd></div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Veränderung</dt><dd className="mt-1 font-semibold text-text-primary">{metric(observations.body.weightChangeKg, " kg")}</dd></div>
            </dl>
            {observations.dailyCheckIns.frequentSymptomTags.length > 0 ? (
              <div className="mt-5">
                <p className="text-xs font-semibold text-text-muted">Häufig dokumentierte Symptome</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {observations.dailyCheckIns.frequentSymptomTags.map(({ value, count }) => (
                    <span key={value} className="rounded-full bg-surface-muted px-3 py-2 text-xs font-medium text-text-primary">{value} · {count}</span>
                  ))}
                </div>
              </div>
            ) : null}
            {observations.dailyCheckIns.trends.energy ? (
              <p className="mt-5 rounded-[var(--radius-md)] border border-border-subtle p-4 text-sm leading-6 text-text-secondary">
                Ø Energie, erste Hälfte: {metric(observations.dailyCheckIns.trends.energy.earlierAverage, " / 10")} · zweite Hälfte: {metric(observations.dailyCheckIns.trends.energy.recentAverage, " / 10")}
              </p>
            ) : null}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Ernährung und Training</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Erfasste Lebensmittel</dt><dd className="mt-1 font-semibold text-text-primary">{observations.nutrition.recordedMealItemCount}</dd></div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Geschätzte Energie</dt><dd className="mt-1 font-semibold text-text-primary">{metric(observations.nutrition.estimatedEnergyKcal, " kcal")}</dd></div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Trainings</dt><dd className="mt-1 font-semibold text-text-primary">{observations.training.completedSessionCount}</dd></div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Dokumentierte Sätze</dt><dd className="mt-1 font-semibold text-text-primary">{observations.training.documentedSetCount}</dd></div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Labor</CardTitle></CardHeader>
          <CardContent>
            {observations.laboratory.latestResults.length > 0 ? (
              <ul className="grid gap-3">
                {observations.laboratory.latestResults.map((result) => (
                  <li key={result.analyteKey} className="flex items-start justify-between gap-4 rounded-[var(--radius-md)] bg-surface-muted p-4">
                    <span><span className="block font-semibold text-text-primary">{result.analyteName}</span><span className="mt-1 block text-xs text-text-muted">{dateLabel(result.measuredAt, context.period.timeZone)}</span></span>
                    <span className="shrink-0 font-semibold text-text-primary">{result.value.toLocaleString("de-DE")} {result.unit}</span>
                  </li>
                ))}
              </ul>
            ) : <p className="text-sm text-text-muted">Noch keine Laborwerte vorhanden.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Supplemente</CardTitle></CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-3">
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Aktive Präparate</dt><dd className="mt-1 font-semibold text-text-primary">{coverage.activeSupplementCount}</dd></div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Einnahmen</dt><dd className="mt-1 font-semibold text-text-primary">{observations.supplements.intakeCount}</dd></div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Positive Beobachtung</dt><dd className="mt-1 font-semibold text-text-primary">{observations.supplements.positiveEffectCount}</dd></div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-4"><dt className="text-xs text-text-muted">Mögliche Reaktion</dt><dd className="mt-1 font-semibold text-text-primary">{observations.supplements.possibleReactionCount}</dd></div>
            </dl>
          </CardContent>
        </Card>
      </section>

      {context.dataGaps.length > 0 ? (
        <section className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised p-5" aria-labelledby="data-gaps-heading">
          <h2 id="data-gaps-heading" className="font-semibold text-text-primary">Noch unvollständige Datengrundlage</h2>
          <ul className="mt-3 grid gap-2 text-sm text-text-muted">
            {context.dataGaps.map((gap) => <li key={gap}>• {gap}</li>)}
          </ul>
        </section>
      ) : null}

      <details className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-forest-strong marker:hidden">
          Technischen Kontext anzeigen
          <span aria-hidden="true">+</span>
        </summary>
        <div className="border-t border-border-subtle p-4">
          <pre className="max-h-[32rem] overflow-auto whitespace-pre-wrap break-words rounded-[var(--radius-md)] bg-surface-muted p-4 text-xs leading-5 text-text-secondary">{JSON.stringify(context, null, 2)}</pre>
        </div>
      </details>
    </div>
  );
}
