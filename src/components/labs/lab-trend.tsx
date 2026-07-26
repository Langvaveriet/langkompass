import Link from "next/link";

import { saveLabTargetRange } from "@/app/laborwerte/actions";
import { labAnalyteByKey } from "@/lib/labs/lab-catalog";
import { labReferenceStatus } from "@/lib/labs/reference-status";
import { buildLabTrend } from "@/lib/labs/lab-trend";

type LabTrendOption = {
  analyteKey: string;
  analyteName: string;
  unit: string;
};

type LabTrendResult = LabTrendOption & {
  id: string;
  measuredAt: Date;
  value: { toString(): string };
  referenceLow: { toString(): string } | null;
  referenceHigh: { toString(): string } | null;
};

type LabTrendProps = {
  options: LabTrendOption[];
  selected: LabTrendOption;
  results: LabTrendResult[];
  reportId: string | null;
  targetRange: {
    targetLow: { toString(): string } | null;
    targetHigh: { toString(): string } | null;
  } | null;
  locale: string;
  timeZone: string;
};

const chartWidth = 600;
const chartHeight = 190;
const plotLeft = 24;
const plotRight = 576;
const plotTop = 22;
const plotBottom = 150;

function referenceRangeLabel(
  low: number | null,
  high: number | null,
  unit: string,
  formatter: Intl.NumberFormat,
): string {
  if (low !== null && high !== null) {
    return `Ref. ${formatter.format(low)}–${formatter.format(high)} ${unit}`;
  }
  if (low !== null) return `Ref. ab ${formatter.format(low)} ${unit}`;
  if (high !== null) return `Ref. bis ${formatter.format(high)} ${unit}`;
  return "Keine Laborreferenz";
}

function targetRangeLabel(
  low: number | null,
  high: number | null,
  unit: string,
  formatter: Intl.NumberFormat,
): string {
  if (low !== null && high !== null) {
    return `Ziel ${formatter.format(low)}–${formatter.format(high)} ${unit}`;
  }
  if (low !== null) return `Ziel ab ${formatter.format(low)} ${unit}`;
  if (high !== null) return `Ziel bis ${formatter.format(high)} ${unit}`;
  return "Noch kein Zielbereich";
}

export function LabTrend({
  options,
  selected,
  results,
  reportId,
  targetRange,
  locale,
  timeZone,
}: LabTrendProps) {
  const trend = buildLabTrend(results.map((result) => ({
    id: result.id,
    measuredAt: result.measuredAt,
    value: Number(result.value),
  })));
  const numberFormatter = new Intl.NumberFormat(locale, { maximumFractionDigits: 4 });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone,
  });
  const minimum = trend.minimum ?? 0;
  const maximum = trend.maximum ?? 0;
  const range = maximum - minimum;
  const padding = Math.max(range * 0.15, Math.abs(maximum || 1) * 0.03);
  const visualMinimum = minimum - padding;
  const visualRange = maximum + padding - visualMinimum || 1;
  const chartPoints = trend.points.map((point, index) => ({
    ...point,
    x: trend.points.length === 1
      ? chartWidth / 2
      : plotLeft + (index / (trend.points.length - 1)) * (plotRight - plotLeft),
    y: plotBottom - ((point.value - visualMinimum) / visualRange) * (plotBottom - plotTop),
  }));
  const polylinePoints = chartPoints.map(({ x, y }) => `${x},${y}`).join(" ");
  const differenceLabel = trend.difference === null
    ? "–"
    : `${trend.difference > 0 ? "+" : ""}${numberFormatter.format(trend.difference)} ${selected.unit}`;
  const selectedCatalogEntry = labAnalyteByKey.get(selected.analyteKey);
  const sourceLabel = selectedCatalogEntry?.sourceLabels?.join(" · ") ?? null;
  const targetLow = targetRange?.targetLow == null
    ? null
    : Number(targetRange.targetLow);
  const targetHigh = targetRange?.targetHigh == null
    ? null
    : Number(targetRange.targetHigh);

  return (
    <section id="laborverlauf" className="mt-10 max-w-4xl" aria-labelledby="lab-trend-heading">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper">Verlauf</p>
      <h2 id="lab-trend-heading" className="mt-2 text-2xl font-semibold text-text-primary">Entwicklung nach Laborparameter</h2>
      <p className="mt-2 text-sm leading-6 text-text-muted">Bis zu 24 Messungen werden chronologisch dargestellt. Die Anzeige beschreibt nur deine gespeicherten Daten.</p>

      <nav aria-label="Laborparameter für den Verlauf auswählen" className="mt-5 flex max-w-full gap-2 overflow-x-auto pb-2">
        {options.map((option) => {
          const active = option.analyteKey === selected.analyteKey;
          const catalogEntry = labAnalyteByKey.get(option.analyteKey);
          const originalLabel = catalogEntry?.sourceLabels?.at(0);
          const reportQuery = reportId ? `report=${encodeURIComponent(reportId)}&` : "";
          return (
            <Link
              key={option.analyteKey}
              href={`/laborwerte?${reportQuery}analyte=${encodeURIComponent(option.analyteKey)}#laborverlauf`}
              aria-current={active ? "page" : undefined}
              className={`min-w-40 shrink-0 rounded-full border px-4 py-3 text-sm ${active ? "border-forest-strong bg-forest-soft text-forest-strong" : "border-border-strong bg-surface-raised text-text-primary"}`}
            >
              <span className="block font-semibold">{catalogEntry?.shortName ?? option.analyteName}</span>
              {originalLabel ? <span className="mt-0.5 block text-xs text-copper">{originalLabel}</span> : null}
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-text-primary">{selected.analyteName}</h3>
            <p className="mt-1 text-sm text-text-muted">{sourceLabel ? `${sourceLabel} · ` : ""}{selected.unit}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-text-muted">Änderung im sichtbaren Zeitraum</p>
            <p className="mt-1 font-semibold text-forest-strong">{differenceLabel}</p>
          </div>
        </div>

        <details className="mt-5 rounded-[var(--radius-md)] border border-border-subtle bg-surface">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-forest-strong marker:hidden">
            Persönlichen Zielbereich festlegen
            <span className="text-xs font-normal text-text-muted">
              {targetRangeLabel(targetLow, targetHigh, selected.unit, numberFormatter)}
            </span>
          </summary>
          <form action={saveLabTargetRange} className="grid gap-4 border-t border-border-subtle p-4 sm:grid-cols-2">
            <input type="hidden" name="analyteKey" value={selected.analyteKey} />
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              Persönliches Ziel von
              <input
                name="targetLow"
                inputMode="decimal"
                defaultValue={targetRange?.targetLow?.toString() ?? ""}
                placeholder="optional"
                className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 font-normal"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              Persönliches Ziel bis
              <input
                name="targetHigh"
                inputMode="decimal"
                defaultValue={targetRange?.targetHigh?.toString() ?? ""}
                placeholder="optional"
                className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 font-normal"
              />
            </label>
            <p className="text-xs leading-5 text-text-muted sm:col-span-2">
              Dieser selbst gesetzte Orientierungsbereich bleibt getrennt von der Laborreferenz und ist keine medizinische Empfehlung.
            </p>
            <button type="submit" className="min-h-12 rounded-[var(--radius-md)] bg-forest-strong px-5 text-sm font-semibold text-white sm:col-span-2 sm:justify-self-start">
              Zielbereich speichern
            </button>
          </form>
        </details>

        {trend.points.length === 1 ? (
          <div className="grid min-h-48 place-content-center text-center">
            <p className="text-3xl font-semibold text-forest-strong">{numberFormatter.format(trend.latestValue ?? 0)} {selected.unit}</p>
            <p className="mt-2 text-sm text-text-muted">Mit einer weiteren Messung wird die Entwicklung sichtbar.</p>
          </div>
        ) : (
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="mt-4 h-auto w-full" role="img" aria-labelledby="lab-chart-title lab-chart-description">
            <title id="lab-chart-title">Verlauf für {selected.analyteName}</title>
            <desc id="lab-chart-description">{trend.points.length} Messungen von {numberFormatter.format(trend.firstValue ?? 0)} bis {numberFormatter.format(trend.latestValue ?? 0)} {selected.unit}.</desc>
            {[plotTop, (plotTop + plotBottom) / 2, plotBottom].map((y) => (
              <line key={y} x1={plotLeft} x2={plotRight} y1={y} y2={y} stroke="var(--border)" strokeWidth="1" />
            ))}
            <polyline points={polylinePoints} fill="none" stroke="var(--forest-strong)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            {chartPoints.map((point) => (
              <circle key={point.id} cx={point.x} cy={point.y} r="6" fill="var(--surface-raised)" stroke="var(--copper)" strokeWidth="4" vectorEffect="non-scaling-stroke" />
            ))}
          </svg>
        )}

        <div className="mt-4 grid gap-2">
          {results.toReversed().map((result) => {
            const value = Number(result.value);
            const low = result.referenceLow === null ? null : Number(result.referenceLow);
            const high = result.referenceHigh === null ? null : Number(result.referenceHigh);
            const status = labReferenceStatus(value, low, high);
            const targetStatus = labReferenceStatus(value, targetLow, targetHigh);
            return (
              <div key={result.id} className="grid gap-1 rounded-[var(--radius-md)] bg-surface px-4 py-3 text-sm sm:grid-cols-[auto_1fr_auto] sm:items-center sm:gap-4">
                <span className="text-text-secondary">{dateFormatter.format(result.measuredAt)}</span>
                <span>
                  <span className="block font-semibold text-text-primary">{numberFormatter.format(value)} {result.unit}</span>
                  <span className="mt-0.5 block text-xs text-text-muted">{referenceRangeLabel(low, high, result.unit, numberFormatter)}</span>
                </span>
                <span className="text-xs text-text-muted">
                  {status === "WITHIN" ? "im Referenzbereich" : status === "BELOW" ? "unter Referenzbereich" : status === "ABOVE" ? "über Referenzbereich" : "ohne Referenzvergleich"}
                  {targetStatus !== "UNAVAILABLE" ? ` · ${targetStatus === "WITHIN" ? "im persönlichen Ziel" : targetStatus === "BELOW" ? "unter persönlichem Ziel" : "über persönlichem Ziel"}` : ""}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
