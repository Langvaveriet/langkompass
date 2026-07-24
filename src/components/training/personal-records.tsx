import { ExerciseThumbnail } from "@/components/training/exercise-thumbnail";
import { Section } from "@/components/layout/section";
import type { PersonalTrainingRecord } from "@/lib/training/personal-records";
import { exerciseVisualByNormalizedName } from "@/lib/training/exercise-catalog";

type PersonalRecordsProps = {
  records: PersonalTrainingRecord[];
  locale: string;
};

export function PersonalRecords({ records, locale }: PersonalRecordsProps) {
  if (records.length === 0) {
    return null;
  }

  const weightFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 2,
  });

  return (
    <Section
      aria-label="Persönliche Bestwerte"
      className="w-full min-w-0 overflow-hidden"
    >
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-copper-strong">
          Persönliche Bestwerte
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-text-primary">
          Deine stärksten erfassten Sätze
        </h2>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Automatisch aus allen abgeschlossenen Trainingseinheiten berechnet.
        </p>
      </div>

      <div className="-mx-1 mt-5 flex w-[calc(100vw-2rem)] max-w-full snap-x gap-3 overflow-x-auto px-1 pb-2">
        {records.map((record) => (
          <article
            key={record.exerciseId}
            className="w-[calc(100vw-3rem)] max-w-80 shrink-0 snap-start rounded-[var(--radius-lg)] border border-border-subtle bg-surface-primary p-4"
          >
            <div className="flex items-center gap-3">
              <ExerciseThumbnail
                name={record.exerciseName}
                visual={exerciseVisualByNormalizedName.get(
                  record.normalizedName,
                )}
              />
              <h3 className="text-sm font-semibold text-text-primary">
                {record.exerciseName}
              </h3>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-2">
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
                <dt className="text-xs text-text-muted">Höchstes Gewicht</dt>
                <dd className="mt-1 text-lg font-semibold text-text-primary">
                  {record.maximumWeightKg === null
                    ? "Körpergewicht"
                    : `${weightFormatter.format(record.maximumWeightKg)} kg`}
                </dd>
              </div>
              <div className="rounded-[var(--radius-md)] bg-surface-muted p-3">
                <dt className="text-xs text-text-muted">Meiste Wdh.</dt>
                <dd className="mt-1 text-lg font-semibold text-text-primary">
                  {record.maximumRepetitions}
                </dd>
              </div>
            </dl>
            <p className="mt-3 text-xs text-text-muted">
              Grundlage: {record.setCount}{" "}
              {record.setCount === 1 ? "erfasster Satz" : "erfasste Sätze"}
            </p>
          </article>
        ))}
      </div>
    </Section>
  );
}
