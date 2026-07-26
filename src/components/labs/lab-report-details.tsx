import Link from "next/link";

import type { Prisma } from "@/generated/prisma/client";
import { LabResultCorrectionForm } from "@/components/labs/lab-result-correction-form";
import { fastingStatusLabels } from "@/lib/labs/lab-catalog";
import { labReferenceStatus } from "@/lib/labs/reference-status";

type ReportWithResults = Prisma.LabReportGetPayload<{
  include: { results: { include: { _count: { select: { revisions: true } } } } };
}>;

type LabReportDetailsProps = {
  report: ReportWithResults;
  targetRanges: Array<{
    analyteKey: string;
    targetLow: { toString(): string } | null;
    targetHigh: { toString(): string } | null;
  }>;
  locale: string;
  timeZone: string;
  editResultId?: string;
};

const referenceLabels = {
  BELOW: "unter Referenzbereich",
  WITHIN: "im Referenzbereich",
  ABOVE: "über Referenzbereich",
  UNAVAILABLE: "ohne Referenzvergleich",
} as const;

function referenceRange(
  low: { toString(): string } | null,
  high: { toString(): string } | null,
  unit: string,
): string | null {
  if (low && high) return `${low.toString()}–${high.toString()} ${unit}`;
  if (low) return `ab ${low.toString()} ${unit}`;
  if (high) return `bis ${high.toString()} ${unit}`;
  return null;
}

export function LabReportDetails({
  report,
  targetRanges,
  locale,
  timeZone,
  editResultId,
}: LabReportDetailsProps) {
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
  const numberFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 4,
  });

  return (
    <div className="rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-copper">Ausgewählte Untersuchung</p>
          <h2 className="mt-1 text-2xl font-semibold text-text-primary">
            {dateFormatter.format(report.collectedAt)}
          </h2>
          <p className="mt-1 text-sm text-text-secondary">
            {timeFormatter.format(report.collectedAt)} Uhr · {fastingStatusLabels[report.fastingStatus]}
          </p>
        </div>
        {report.laboratory ? (
          <span className="rounded-full bg-surface-muted px-4 py-2 text-sm text-text-secondary">{report.laboratory}</span>
        ) : null}
      </div>

      {report.results.length > 0 ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {report.results.map((result) => {
            const value = Number(result.value);
            const low = result.referenceLow === null ? null : Number(result.referenceLow);
            const high = result.referenceHigh === null ? null : Number(result.referenceHigh);
            const status = labReferenceStatus(value, low, high);
            const range = referenceRange(result.referenceLow, result.referenceHigh, result.unit);
            const targetRange = targetRanges.find(
              ({ analyteKey }) => analyteKey === result.analyteKey,
            );
            const target = referenceRange(
              targetRange?.targetLow ?? null,
              targetRange?.targetHigh ?? null,
              result.unit,
            );
            const targetStatus = labReferenceStatus(
              value,
              targetRange?.targetLow == null ? null : Number(targetRange.targetLow),
              targetRange?.targetHigh == null ? null : Number(targetRange.targetHigh),
            );
            return (
              <article key={result.id} className={`rounded-[var(--radius-lg)] border bg-surface p-4 ${editResultId === result.id ? "border-copper" : "border-border"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-text-primary">{result.analyteName}</h3>
                    <p className="mt-2 text-2xl font-semibold text-forest-strong">
                      {numberFormatter.format(value)} <span className="text-sm font-normal text-text-secondary">{result.unit}</span>
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${status === "WITHIN" ? "bg-forest-soft text-forest-strong" : status === "UNAVAILABLE" ? "bg-surface-muted text-text-secondary" : "bg-copper-soft text-copper"}`}>
                    {referenceLabels[status]}
                  </span>
                </div>
                {range ? <p className="mt-3 text-sm text-text-muted">Laborreferenz: {range}</p> : null}
                {target ? (
                  <p className="mt-1 text-sm text-text-muted">
                    Persönliches Ziel: {target} · {targetStatus === "WITHIN" ? "im Ziel" : targetStatus === "BELOW" ? "darunter" : "darüber"}
                  </p>
                ) : null}
                {result.note ? <p className="mt-2 text-sm leading-6 text-text-secondary">{result.note}</p> : null}
                {result._count.revisions > 0 ? (
                  <p className="mt-2 text-xs font-semibold text-copper">
                    {result._count.revisions} {result._count.revisions === 1 ? "frühere Version" : "frühere Versionen"} gespeichert
                  </p>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-x-4">
                  <Link
                    href={`/laborwerte?report=${encodeURIComponent(report.id)}&analyte=${encodeURIComponent(result.analyteKey)}#laborverlauf`}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-forest-strong"
                  >
                    Verlauf ansehen →
                  </Link>
                  <Link
                    href={`/laborwerte?report=${encodeURIComponent(report.id)}&analyte=${encodeURIComponent(result.analyteKey)}&editResult=${encodeURIComponent(result.id)}`}
                    className="inline-flex min-h-11 items-center text-sm font-semibold text-copper"
                  >
                    Wert korrigieren
                  </Link>
                </div>
                {editResultId === result.id ? (
                  <LabResultCorrectionForm
                    result={result}
                    reportId={report.id}
                    analyteKey={result.analyteKey}
                  />
                ) : null}
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-[var(--radius-lg)] bg-surface p-5">
          <p className="font-semibold text-text-primary">Noch keine Laborwerte erfasst.</p>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Wähle unten einen Parameter aus und übernimm Wert sowie Referenzbereich direkt aus dem Laborbericht.
          </p>
        </div>
      )}

      {report.physicianComment || report.notes || report.controlDate ? (
        <details className="mt-5 rounded-[var(--radius-md)] border border-border bg-surface">
          <summary className="flex min-h-12 cursor-pointer list-none items-center px-4 text-sm font-semibold text-forest-strong marker:hidden">Begleitende Angaben</summary>
          <div className="grid gap-3 border-t border-border p-4 text-sm leading-6 text-text-secondary">
            {report.controlDate ? (
              <p><strong className="text-text-primary">Kontrolltermin:</strong> {new Intl.DateTimeFormat(locale, { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(report.controlDate)}</p>
            ) : null}
            {report.physicianComment ? <p><strong className="text-text-primary">Arztkommentar:</strong> {report.physicianComment}</p> : null}
            {report.notes ? <p><strong className="text-text-primary">Eigene Notiz:</strong> {report.notes}</p> : null}
          </div>
        </details>
      ) : null}
    </div>
  );
}
