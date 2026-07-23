import { saveDailyEntry } from "@/app/tageserfassung/actions";
import { ChipSelector } from "@/components/health-input/chip-selector";
import { RatingSelector } from "@/components/health-input/rating-selector";
import { ScaleSlider } from "@/components/health-input/scale-slider";
import { SleepDurationPicker } from "@/components/health-input/sleep-duration-picker";
import { WeightPicker } from "@/components/health-input/weight-picker";
import { Button } from "@/components/ui/button";

export type DailyEntryStatus =
  | "OPEN"
  | "MORNING_DONE"
  | "COMPLETED";

export type DailyEntryFormValues = {
  status: DailyEntryStatus;
  entryDate: string;
  weightKg: string;
  suggestedWeightKg: string;
  weightMeasuredTime: string;
  wellbeing: number | null;
  energy: number | null;
  sleepHours: string;
  sleepQuality: number | null;
  painLevel: number | null;
  stressLevel: number | null;
  symptomTags: string[];
  activityTags: string[];
  notes: string;
};

type DailyEntryFormProps = {
  values: DailyEntryFormValues;
  status: DailyEntryStatus;
};

const wellbeingOptions = [
  { value: 2, emoji: "😞", label: "Sehr schlecht" },
  { value: 4, emoji: "🙁", label: "Schlecht" },
  { value: 6, emoji: "😐", label: "Mittel" },
  { value: 8, emoji: "🙂", label: "Gut" },
  { value: 10, emoji: "😄", label: "Sehr gut" },
];

const energyOptions = [
  { value: 2, emoji: "🪫", label: "Leer" },
  { value: 4, emoji: "🥱", label: "Niedrig" },
  { value: 6, emoji: "🔋", label: "Normal" },
  { value: 8, emoji: "⚡", label: "Hoch" },
  { value: 10, emoji: "🚀", label: "Voll" },
];

const sleepQualityOptions = [
  { value: 2, emoji: "😵", label: "Sehr schlecht" },
  { value: 4, emoji: "🌘", label: "Schlecht" },
  { value: 6, emoji: "🌗", label: "Mittel" },
  { value: 8, emoji: "🌖", label: "Gut" },
  { value: 10, emoji: "🌕", label: "Sehr gut" },
];

const symptomOptions = [
  { value: "joint-stiffness", label: "Gelenksteifigkeit", emoji: "🦴" },
  { value: "joint-pain", label: "Gelenkschmerzen", emoji: "⚡" },
  { value: "muscle-pain", label: "Muskelschmerzen", emoji: "💪" },
  { value: "headache", label: "Kopfschmerzen", emoji: "🤕" },
  { value: "fatigue", label: "Müdigkeit", emoji: "🥱" },
  { value: "dizziness", label: "Schwindel", emoji: "💫" },
  { value: "stomach", label: "Magenbeschwerden", emoji: "🫃" },
  { value: "digestion", label: "Verdauung", emoji: "🫧" },
  { value: "skin", label: "Haut", emoji: "🖐️" },
  { value: "swelling", label: "Schwellungen", emoji: "🔴" },
  { value: "breathing", label: "Atemwege", emoji: "🫁" },
  { value: "fever", label: "Fieber", emoji: "🌡️" },
];

const activityOptions = [
  { value: "walk", label: "Spaziergang", emoji: "🚶" },
  { value: "strength", label: "Krafttraining", emoji: "🏋️" },
  { value: "cardio", label: "Cardio", emoji: "🏃" },
  { value: "cycling", label: "Fahrrad", emoji: "🚴" },
  { value: "gardening", label: "Gartenarbeit", emoji: "🌱" },
  { value: "housework", label: "Hausarbeit", emoji: "🧹" },
  { value: "physical-work", label: "Körperliche Arbeit", emoji: "🪵" },
  { value: "rest-day", label: "Ruhetag", emoji: "🛋️" },
  { value: "high-stress", label: "Stressiger Tag", emoji: "🫨" },
  { value: "travel", label: "Reise", emoji: "🚗" },
  { value: "alcohol", label: "Alkohol", emoji: "🍷" },
  { value: "illness", label: "Krankheit", emoji: "🤒" },
];

export function DailyEntryForm({
  values,
  status,
}: DailyEntryFormProps) {
  const progress =
    status === "COMPLETED" ? 100 : status === "MORNING_DONE" ? 50 : 0;

  const eveningAvailable = status !== "OPEN";
  const dayCompleted = status === "COMPLETED";
  return (
    <form action={saveDailyEntry} className="grid gap-8">
      <div className="grid gap-2">
        <label
          htmlFor="entryDate"
          className="text-sm font-semibold text-text-primary"
        >
          Datum
        </label>

        <input
          id="entryDate"
          name="entryDate"
          type="date"
          required
          defaultValue={values.entryDate}
          className="min-h-12 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base text-text-primary outline-none transition focus:border-forest-strong focus:ring-2 focus:ring-forest-soft"
        />
      </div>

      <section className="rounded-[var(--radius-lg)] border border-border-subtle bg-surface-primary p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              Tagesfortschritt
            </p>

            <p className="mt-1 text-lg font-semibold text-text-primary">
              {progress}% erledigt
            </p>
          </div>

          <span className="text-sm font-medium text-text-muted">
            {status === "COMPLETED"
              ? "Abgeschlossen"
              : status === "MORNING_DONE"
                ? "Morgen erledigt"
                : "Noch offen"}
          </span>
        </div>

        <div
          className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted"
          aria-label={`Tagesfortschritt ${progress}%`}
        >
          <div
            className="h-full rounded-full bg-forest-strong transition-[width]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </section>

      <section className="grid gap-6 rounded-[var(--radius-lg)] bg-surface-muted p-4 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            Morgen-Check
          </p>

          <h2 className="mt-1 text-lg font-semibold text-text-primary">
            Wie bist du heute gestartet?
          </h2>
        </div>

        <RatingSelector
          name="sleepQuality"
          label="Schlafqualität"
          defaultValue={values.sleepQuality}
          options={sleepQualityOptions}
        />

        <SleepDurationPicker defaultValue={values.sleepHours} />

        <WeightPicker
          defaultValue={values.weightKg}
          suggestedValue={values.suggestedWeightKg}
          defaultTime={values.weightMeasuredTime}
        />

        <RatingSelector
          name="energy"
          label="Energie am Morgen"
          defaultValue={values.energy}
          options={energyOptions}
        />

        <ChipSelector
          name="symptomTags"
          label="Symptome nach dem Aufstehen"
          options={symptomOptions}
          defaultValues={values.symptomTags}
          emptyOption={{
            label: "Keine Symptome",
            emoji: "✓",
          }}
        />
      </section>

      <details
        open={eveningAvailable}
        className="group rounded-[var(--radius-lg)] border border-border-subtle bg-surface-primary"
      >
        <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
              Abend-Check
            </p>

            <h2 className="mt-1 font-semibold text-text-primary">
              {eveningAvailable
                ? "Wie hat sich dein Tag entwickelt?"
                : "Nach dem Morgen-Check verfügbar"}
            </h2>
          </div>

          <span
            aria-hidden="true"
            className="text-xl transition group-open:rotate-45"
          >
            +
          </span>
        </summary>

        <div className="grid gap-6 border-t border-border-subtle px-4 py-5 sm:px-6">
          <RatingSelector
            name="wellbeing"
            label="Wohlbefinden am Abend"
            defaultValue={values.wellbeing}
            options={wellbeingOptions}
          />

          <ScaleSlider
            name="painLevel"
            label="Schmerzen"
            defaultValue={values.painLevel}
            minimumLabel="Keine"
            maximumLabel="Sehr stark"
          />

          <ScaleSlider
            name="stressLevel"
            label="Stress"
            defaultValue={values.stressLevel}
            minimumLabel="Entspannt"
            maximumLabel="Sehr hoch"
          />

          <ChipSelector
            name="activityTags"
            label="Aktivitäten und Einflüsse"
            options={activityOptions}
            defaultValues={values.activityTags}
            emptyOption={{
              label: "Nichts Besonderes",
              emoji: "○",
            }}
          />

          <div>
            <label
              htmlFor="notes"
              className="mb-2 block text-sm font-semibold text-text-primary"
            >
              Optionale Tagesnotiz
            </label>

            <textarea
              id="notes"
              name="notes"
              rows={4}
              defaultValue={values.notes}
              placeholder="Nur ergänzen, wenn etwas Besonderes festgehalten werden soll."
              className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 py-3 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-forest-strong focus:ring-2 focus:ring-forest-soft"
            />
          </div>
        </div>
      </details>

      <div className="sticky bottom-4 z-10 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-primary/95 p-3 shadow-lg backdrop-blur">
        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="submit"
            name="submitIntent"
            value="save"
            variant="secondary"
            className="min-h-12 w-full justify-center text-base"
          >
            {status === "OPEN"
              ? "Morgen-Check speichern"
              : "Zwischenstand speichern"}
          </Button>

          <Button
            type="submit"
            name="submitIntent"
            value="complete"
            disabled={!eveningAvailable || dayCompleted}
            className="min-h-12 w-full justify-center text-base"
          >
            {dayCompleted ? "Tag abgeschlossen" : "Tag abschließen"}
          </Button>
        </div>
      </div>
    </form>
  );
}
