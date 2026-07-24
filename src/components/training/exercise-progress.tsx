import Link from "next/link";

import { ExerciseThumbnail } from "@/components/training/exercise-thumbnail";
import { Card, CardContent } from "@/components/ui/card";
import type {
  ExerciseProgress as ExerciseProgressData,
  ExerciseProgressMetric,
} from "@/lib/training/exercise-progress";
import { exerciseVisualByNormalizedName } from "@/lib/training/exercise-catalog";

type ExerciseOption = {
  id: string;
  name: string;
  normalizedName: string;
};

type ExerciseProgressProps = {
  exercises: ExerciseOption[];
  selectedExercise: ExerciseOption;
  progress: ExerciseProgressData;
  locale: string;
  timeZone: string;
};

const chartWidth = 600;
const chartHeight = 190;
const plotLeft = 20;
const plotRight = 580;
const plotTop = 22;
const plotBottom = 152;

function unitForMetric(metric: ExerciseProgressMetric): string {
  return metric === "weight" ? "kg" : "Wdh.";
}

export function ExerciseProgress({
  exercises,
  selectedExercise,
  progress,
  locale,
  timeZone,
}: ExerciseProgressProps) {
  const numberFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  });
  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "2-digit",
    timeZone,
  });
  const unit = unitForMetric(progress.metric);
  const firstPoint = progress.points.at(0);
  const lastPoint = progress.points.at(-1);
  const values = progress.points.map((point) => point.value);
  const minimum = values.length > 0 ? Math.min(...values) : 0;
  const maximum = values.length > 0 ? Math.max(...values) : 0;
  const range = maximum - minimum;
  const verticalPadding = Math.max(
    range * 0.15,
    progress.metric === "weight" ? 0.5 : 1,
  );
  const visualMinimum = minimum - verticalPadding;
  const visualMaximum = maximum + verticalPadding;
  const visualRange = visualMaximum - visualMinimum;
  const chartPoints = progress.points.map((point, index) => {
    const x =
      progress.points.length === 1
        ? chartWidth / 2
        : plotLeft +
          (index / (progress.points.length - 1)) * (plotRight - plotLeft);
    const y =
      plotBottom -
      ((point.value - visualMinimum) / visualRange) *
        (plotBottom - plotTop);

    return { ...point, x, y };
  });
  const polylinePoints = chartPoints
    .map((point) => `${point.x},${point.y}`)
    .join(" ");
  const areaPoints = `${plotLeft},${plotBottom} ${polylinePoints} ${plotRight},${plotBottom}`;
  const difference =
    firstPoint && lastPoint ? lastPoint.value - firstPoint.value : 0;
  const differenceLabel = `${difference > 0 ? "+" : ""}${numberFormatter.format(difference)} ${unit}`;
  const summary =
    !firstPoint || !lastPoint
      ? "Für diese Übung liegt noch kein vergleichbarer Satzwert vor."
      : progress.points.length === 1
        ? `Eine abgeschlossene Einheit mit ${numberFormatter.format(lastPoint.value)} ${unit} ist erfasst.`
        : difference === 0
          ? `Der erste und der letzte sichtbare Bestwert liegen bei ${numberFormatter.format(lastPoint.value)} ${unit}.`
          : `Der letzte sichtbare Bestwert liegt ${numberFormatter.format(Math.abs(difference))} ${unit} ${difference > 0 ? "über" : "unter"} dem ersten.`;

  return (
    <section
      id="fortschritt"
      aria-labelledby="exercise-progress-title"
      className="mt-10 w-full min-w-0 overflow-hidden"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper-strong">
          Fortschritt
        </p>
        <h2
          id="exercise-progress-title"
          className="mt-2 text-2xl font-semibold text-text-primary"
        >
          Entwicklung je Übung
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Wähle eine Übung. Angezeigt werden bis zu zwölf abgeschlossene
          Einheiten.
        </p>
      </div>

      <nav
        aria-label="Übung für den Fortschrittsverlauf auswählen"
        className="-mx-1 mt-5 flex w-[calc(100vw-2rem)] max-w-full gap-2 overflow-x-auto px-1 pb-2"
      >
        {exercises.map((exercise) => {
          const selected = exercise.id === selectedExercise.id;

          return (
            <Link
              key={exercise.id}
              href={`/training/verlauf?exercise=${encodeURIComponent(exercise.id)}#fortschritt`}
              aria-current={selected ? "page" : undefined}
              className={`flex min-h-14 min-w-40 shrink-0 items-center gap-2 rounded-full border px-2 pr-4 text-sm font-semibold ${
                selected
                  ? "border-forest-strong bg-forest-soft text-forest-strong"
                  : "border-border-subtle bg-surface-primary text-text-primary"
              }`}
            >
              <ExerciseThumbnail
                name={exercise.name}
                visual={exerciseVisualByNormalizedName.get(
                  exercise.normalizedName,
                )}
              />
              <span className="max-w-28 leading-5">{exercise.name}</span>
            </Link>
          );
        })}
      </nav>

      <Card className="mt-4">
        <CardContent>
          <div className="flex items-center gap-3">
            <ExerciseThumbnail
              name={selectedExercise.name}
              visual={exerciseVisualByNormalizedName.get(
                selectedExercise.normalizedName,
              )}
            />
            <div>
              <h3 className="font-semibold text-text-primary">
                {selectedExercise.name}
              </h3>
              <p className="mt-0.5 text-xs text-text-muted">
                {progress.metric === "weight"
                  ? "Höchstes Gewicht je Einheit"
                  : "Meiste Wiederholungen je Einheit"}
              </p>
            </div>
          </div>

          {!firstPoint || !lastPoint ? (
            <div className="grid min-h-52 place-content-center text-center">
              <p className="font-semibold text-text-primary">
                Noch kein Verlauf verfügbar
              </p>
              <p className="mt-2 max-w-sm text-sm leading-6 text-text-muted">
                Nach der ersten abgeschlossenen Einheit erscheint hier der
                erste Wert.
              </p>
            </div>
          ) : progress.points.length === 1 ? (
            <div className="grid min-h-52 place-content-center text-center">
              <p className="text-3xl font-semibold text-forest-strong">
                {numberFormatter.format(lastPoint.value)} {unit}
              </p>
              <p className="mt-2 text-sm leading-6 text-text-muted">
                Mit einer weiteren Einheit wird die Entwicklung sichtbar.
              </p>
            </div>
          ) : (
            <>
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="mt-4 h-auto w-full"
                role="img"
                aria-labelledby="exercise-chart-title exercise-chart-description"
              >
                <title id="exercise-chart-title">
                  {`Verlauf für ${selectedExercise.name}`}
                </title>
                <desc id="exercise-chart-description">
                  {`${progress.points.length} Einheiten von ${numberFormatter.format(firstPoint.value)} bis ${numberFormatter.format(lastPoint.value)} ${unit}.`}
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
                    key={point.sessionId}
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
                <span>{dateFormatter.format(firstPoint.completedAt)}</span>
                <span>{dateFormatter.format(lastPoint.completedAt)}</span>
              </div>
            </>
          )}

          <p className="mt-5 rounded-[var(--radius-md)] bg-surface-muted px-4 py-3 text-sm leading-6 text-text-primary">
            {summary}
          </p>

          {firstPoint && lastPoint ? (
            <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border-subtle pt-4 sm:grid-cols-3">
              <div>
                <dt className="text-xs text-text-muted">Letzter Wert</dt>
                <dd className="mt-1 font-semibold text-text-primary">
                  {numberFormatter.format(lastPoint.value)} {unit}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted">Veränderung</dt>
                <dd className="mt-1 font-semibold text-text-primary">
                  {progress.points.length > 1 ? differenceLabel : "–"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-muted">Einheiten</dt>
                <dd className="mt-1 font-semibold text-text-primary">
                  {progress.points.length}
                </dd>
              </div>
            </dl>
          ) : null}
        </CardContent>
      </Card>
    </section>
  );
}
