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
  const laboratory = response.laboratoryAssessment;
  const laboratoryResultCount =
    laboratory.assessedCount + laboratory.withoutReferenceCount;

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

        {laboratoryResultCount > 0 ? (
          <section
            className="overflow-hidden rounded-[var(--radius-lg)] border border-border-strong"
            aria-labelledby="laboratory-assessment-heading"
          >
            <div className="border-b border-border-subtle bg-forest-soft p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-copper">
                Labor
              </p>
              <h3
                id="laboratory-assessment-heading"
                className="mt-1.5 text-xl font-semibold text-text-primary"
              >
                Einordnung der Laborwerte
              </h3>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                Mögliche Einflussfaktoren sind Hypothesen, keine festgestellten
                Ursachen. Compass zeigt deshalb nur Abweichungen und sinnvolle
                nächste Schritte – keine einzelnen Messzahlen.
              </p>
              <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  ["Beurteilbar", laboratory.assessedCount],
                  ["Außerhalb Referenz", laboratory.outsideReferenceCount],
                  ["Innerhalb Referenz", laboratory.withinReferenceCount],
                  ["Ohne Referenz", laboratory.withoutReferenceCount],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-[var(--radius-md)] bg-surface-raised p-3">
                    <dt className="text-xs text-text-muted">{label}</dt>
                    <dd className="mt-1 font-semibold text-text-primary">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {laboratory.insights.length > 0 ? (
              <div className="grid gap-4 p-4 sm:p-5">
                {laboratory.insights.map((insight) => (
                  <article
                    key={insight.analyteKey}
                    className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface-raised p-4 sm:p-5"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-copper">
                          {insight.status === "ABOVE"
                            ? "Oberhalb der Laborreferenz"
                            : "Unterhalb der Laborreferenz"}
                        </p>
                        <h4 className="mt-1 text-lg font-semibold text-text-primary">
                          {insight.analyteName}
                        </h4>
                      </div>
                      <span className="rounded-full bg-copper-soft px-3 py-1.5 text-xs font-semibold text-copper">
                        Abklärung sinnvoll
                      </span>
                    </div>

                    <p className="mt-4 text-sm leading-6 text-text-secondary">
                      {insight.assessment}
                    </p>

                    <div className="mt-5 grid gap-4 lg:grid-cols-3">
                      <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                        <h5 className="text-sm font-semibold text-text-primary">
                          Mögliche Einflussfaktoren
                        </h5>
                        <ul className="mt-3 grid gap-2 text-sm leading-5 text-text-secondary">
                          {insight.possibleFactors.map((factor) => (
                            <li key={factor}>• {factor}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
                        <h5 className="text-sm font-semibold text-text-primary">
                          Sinnvolle nächste Schritte
                        </h5>
                        <ul className="mt-3 grid gap-2 text-sm leading-5 text-text-secondary">
                          {insight.nextSteps.map((step) => (
                            <li key={step}>• {step}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="rounded-[var(--radius-md)] bg-forest-soft p-4">
                        <h5 className="text-sm font-semibold text-forest-strong">
                          Natürliche Unterstützung
                        </h5>
                        <ul className="mt-3 grid gap-2 text-sm leading-5 text-text-secondary">
                          {insight.naturalOptions.map((option) => (
                            <li key={option}>• {option}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className="p-5 text-sm leading-6 text-text-secondary">
                Für die beurteilbaren Parameter liegt aktuell keine Abweichung
                vom jeweils gespeicherten Laborreferenzbereich vor. Das schließt
                gesundheitliche Probleme nicht aus und ersetzt keine
                Gesamtbeurteilung.
              </p>
            )}

            <div className="border-t border-border-subtle px-4 py-3 text-xs leading-5 text-text-muted sm:px-5">
              Medizinischer Hintergrund: {" "}
              <a
                href="https://medlineplus.gov/lab-tests/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-forest-strong"
              >
                MedlinePlus
              </a>
              {" · "}
              <a
                href="https://www.niddk.nih.gov/health-information/kidney-disease/chronic-kidney-disease-ckd/tests-diagnosis"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-forest-strong"
              >
                NIDDK-Nierenwerte
              </a>
              {" · "}
              <a
                href="https://www.cdc.gov/cholesterol/about/ldl-and-hdl-cholesterol-and-triglycerides.html"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-forest-strong"
              >
                CDC-Blutfette
              </a>
              {" · "}
              <a
                href="https://www.thyroid.org/thyroid-function-tests/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-forest-strong"
              >
                ATA-Schilddrüse
              </a>
              {" · "}
              <a
                href="https://ods.od.nih.gov/factsheets/list-all/"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-forest-strong"
              >
                NIH-Nährstoffinformationen
              </a>
            </div>
          </section>
        ) : null}

        <div className="rounded-[var(--radius-md)] border border-border-subtle p-4">
          <p className="text-xs font-semibold text-text-primary">Provider-Vertrag</p>
          <p className="mt-1 text-sm text-text-muted">{response.provider.label} · {response.responseVersion}</p>
          <p className="mt-3 text-xs leading-5 text-text-muted">{response.safetyNotice}</p>
        </div>
      </div>
    </section>
  );
}
