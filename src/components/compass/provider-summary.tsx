import type { CompassAnalysisResponse } from "@/lib/compass/provider";

type ProviderSummaryProps = {
  response: CompassAnalysisResponse;
};

const categoryLabels: Record<CompassAnalysisResponse["statements"][number]["category"], string> = {
  DAILY_LIFE: "Alltag",
  BODY: "Körper",
  NUTRITION: "Ernährung",
  TRAINING: "Training",
  LABORATORY: "Labor",
  SUPPLEMENTS: "Supplemente",
};

export function ProviderSummary({ response }: ProviderSummaryProps) {
  return (
    <section className="mt-8 max-w-5xl rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised" aria-labelledby="provider-summary-heading">
      <div className="border-b border-border-subtle p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Adapter aktiv</p>
            <h2 id="provider-summary-heading" className="mt-2 text-2xl font-semibold text-text-primary">{response.title}</h2>
          </div>
          <span className="rounded-full bg-forest-soft px-4 py-2 text-xs font-semibold text-forest-strong">Lokal · keine Übertragung</span>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-text-muted">{response.summary}</p>
      </div>

      <div className="grid gap-4 p-5 sm:p-6">
        {response.statements.length > 0 ? (
          <ul className="grid gap-3">
            {response.statements.map((statement) => (
              <li key={`${statement.category}-${statement.text}`} className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                <p className="text-xs font-semibold text-copper">{categoryLabels[statement.category]}</p>
                <p className="mt-1 text-sm leading-6 text-text-primary">{statement.text}</p>
                <p className="mt-2 text-xs text-text-muted">Datengrundlage: {statement.evidencePaths.join(" · ")}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-[var(--radius-md)] bg-surface-muted p-4 text-sm text-text-muted">Erfasse zunächst Gesundheitsdaten, damit Compass daraus belegte Beobachtungen formulieren kann.</p>
        )}

        <div className="rounded-[var(--radius-md)] border border-border-subtle p-4">
          <p className="text-xs font-semibold text-text-primary">Provider-Vertrag</p>
          <p className="mt-1 text-sm text-text-muted">{response.provider.label} · {response.responseVersion}</p>
          <p className="mt-3 text-xs leading-5 text-text-muted">{response.safetyNotice}</p>
        </div>
      </div>
    </section>
  );
}
