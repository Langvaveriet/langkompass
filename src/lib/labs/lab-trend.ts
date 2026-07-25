export type LabTrendInput = {
  id: string;
  measuredAt: Date;
  value: number;
};

export type LabTrend = {
  points: LabTrendInput[];
  firstValue: number | null;
  latestValue: number | null;
  difference: number | null;
  minimum: number | null;
  maximum: number | null;
};

/**
 * Sortiert Laborwerte chronologisch und ermittelt ausschließlich beschreibende
 * Kennzahlen. Eine medizinische Interpretation findet hier nicht statt.
 */
export function buildLabTrend(inputs: LabTrendInput[]): LabTrend {
  const points = inputs
    .filter(({ value }) => Number.isFinite(value))
    .toSorted((left, right) => left.measuredAt.getTime() - right.measuredAt.getTime());
  const firstValue = points.at(0)?.value ?? null;
  const latestValue = points.at(-1)?.value ?? null;
  const values = points.map(({ value }) => value);

  return {
    points,
    firstValue,
    latestValue,
    difference: firstValue === null || latestValue === null
      ? null
      : latestValue - firstValue,
    minimum: values.length > 0 ? Math.min(...values) : null,
    maximum: values.length > 0 ? Math.max(...values) : null,
  };
}
