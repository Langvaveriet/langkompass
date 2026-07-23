import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WeightMeasurement = {
  id: string;
  value: unknown;
  measuredAt: Date;
};

type WeightTrendProps = {
  measurements: WeightMeasurement[];
  timeZone: string;
};

const chartWidth = 600;
const chartHeight = 180;
const plotLeft = 18;
const plotRight = 582;
const plotTop = 20;
const plotBottom = 146;

function formatWeight(value: number): string {
  return value.toFixed(1).replace(".", ",");
}

export function WeightTrend({
  measurements,
  timeZone,
}: WeightTrendProps) {
  const points = measurements.map((measurement) => ({
    ...measurement,
    numericValue: Number(measurement.value),
  }));
  const firstPoint = points.at(0);
  const lastPoint = points.at(-1);
  const dateFormatter = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    timeZone,
  });

  if (!firstPoint || !lastPoint) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Gewichtsverlauf</CardTitle>
        </CardHeader>
        <CardContent className="grid min-h-64 place-content-center gap-4 text-center">
          <div>
            <p className="font-semibold text-text-primary">
              Noch keine Gewichtsmessung
            </p>
            <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
              Erfasse dein Gewicht im Morgen-Check. Der Verlauf erscheint hier
              automatisch, sobald echte Messwerte vorliegen.
            </p>
          </div>
          <Link
            href="/tageserfassung"
            className="text-sm font-semibold text-forest-strong"
          >
            Gewicht erfassen →
          </Link>
        </CardContent>
      </Card>
    );
  }

  const values = points.map((point) => point.numericValue);
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const range = maximum - minimum;
  const verticalPadding = Math.max(range * 0.15, 0.2);
  const visualMinimum = minimum - verticalPadding;
  const visualMaximum = maximum + verticalPadding;
  const visualRange = visualMaximum - visualMinimum;
  const chartPoints = points.map((point, index) => {
    const x =
      points.length === 1
        ? chartWidth / 2
        : plotLeft +
          (index / (points.length - 1)) * (plotRight - plotLeft);
    const y =
      plotBottom -
      ((point.numericValue - visualMinimum) / visualRange) *
        (plotBottom - plotTop);

    return { x, y, ...point };
  });
  const polylinePoints = chartPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
  const areaPoints = `${plotLeft},${plotBottom} ${polylinePoints} ${plotRight},${plotBottom}`;
  const difference = lastPoint.numericValue - firstPoint.numericValue;
  const differenceLabel = `${difference > 0 ? "+" : ""}${formatWeight(difference)} kg`;

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3">
        <div>
          <CardTitle>Gewichtsverlauf</CardTitle>
          <p className="mt-1 text-xs text-text-muted">Letzte 30 Tage</p>
        </div>
        <p className="text-xl font-semibold text-forest-strong">
          {formatWeight(lastPoint.numericValue)} kg
        </p>
      </CardHeader>

      <CardContent>
        {points.length === 1 ? (
          <div className="grid min-h-52 place-content-center text-center">
            <p className="font-semibold text-text-primary">
              Erster Messwert gespeichert
            </p>
            <p className="mt-2 text-sm leading-6 text-text-muted">
              Mit einer weiteren Messung wird die Entwicklung sichtbar.
            </p>
          </div>
        ) : (
          <>
            <svg
              viewBox={`0 0 ${chartWidth} ${chartHeight}`}
              className="h-auto w-full"
              role="img"
              aria-labelledby="weight-chart-title weight-chart-description"
            >
              <title id="weight-chart-title">Gewichtsverlauf</title>
              <desc id="weight-chart-description">
                {points.length} Messwerte von{" "}
                {formatWeight(firstPoint.numericValue)} bis{" "}
                {formatWeight(lastPoint.numericValue)} Kilogramm.
              </desc>
              {[plotTop, (plotTop + plotBottom) / 2, plotBottom].map((y) => (
                <line
                  key={y}
                  x1={plotLeft}
                  x2={plotRight}
                  y1={y}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth="1"
                />
              ))}
              <polygon points={areaPoints} fill="var(--forest-soft)" />
              <polyline
                points={polylinePoints}
                fill="none"
                stroke="var(--forest-strong)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {chartPoints.map((point) => (
                <circle
                  key={point.id}
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  fill="var(--surface-raised)"
                  stroke="var(--forest-strong)"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              ))}
            </svg>

            <div className="flex justify-between text-xs text-text-muted">
              <span>{dateFormatter.format(firstPoint.measuredAt)}</span>
              <span>{dateFormatter.format(lastPoint.measuredAt)}</span>
            </div>
          </>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-border-subtle pt-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-text-muted">Veränderung</dt>
            <dd className="mt-1 font-semibold text-text-primary">
              {points.length > 1 ? differenceLabel : "–"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted">Spanne</dt>
            <dd className="mt-1 font-semibold text-text-primary">
              {formatWeight(minimum)}–{formatWeight(maximum)} kg
            </dd>
          </div>
          <div>
            <dt className="text-xs text-text-muted">Messwerte</dt>
            <dd className="mt-1 font-semibold text-text-primary">
              {points.length}
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
