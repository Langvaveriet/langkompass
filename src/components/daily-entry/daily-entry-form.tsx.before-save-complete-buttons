import { saveDailyEntry } from "@/app/tageserfassung/actions";
import { ChipSelector } from "@/components/health-input/chip-selector";
import { RatingSelector } from "@/components/health-input/rating-selector";
import { ScaleSlider } from "@/components/health-input/scale-slider";
import { SleepDurationPicker } from "@/components/health-input/sleep-duration-picker";
import { Button } from "@/components/ui/button";

export type DailyEntryFormValues = {
  entryDate: string;
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
}: DailyEntryFormProps) {
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

      <section className="grid gap-6 rounded-[var(--radius-lg)] bg-surface-muted p-4 sm:p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-text-muted">
            Quick Check
          </p>

          <h2 className="mt-1 text-lg font-semibold text-text-primary">
            Wie war dein Tag?
          </h2>
        </div>

        <RatingSelector
          name="wellbeing"
          label="Wohlbefinden"
          defaultValue={values.wellbeing}
          options={wellbeingOptions}
        />

        <RatingSelector
          name="energy"
          label="Energie"
          defaultValue={values.energy}
          options={energyOptions}
        />

        <RatingSelector
          name="sleepQuality"
          label="Schlafqualität"
          defaultValue={values.sleepQuality}
          options={sleepQualityOptions}
        />

        <SleepDurationPicker defaultValue={values.sleepHours} />

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
      </section>

      <details className="group rounded-[var(--radius-lg)] border border-border-subtle bg-surface-primary">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-semibold text-text-primary sm:px-6">
          Symptome hinzufügen

          <span
            aria-hidden="true"
            className="text-xl transition group-open:rotate-45"
          >
            +
          </span>
        </summary>

        <div className="border-t border-border-subtle px-4 py-5 sm:px-6">
          <ChipSelector
            name="symptomTags"
            label="Was ist heute aufgefallen?"
            options={symptomOptions}
            defaultValues={values.symptomTags}
            emptyOption={{
              label: "Keine Symptome",
              emoji: "✓",
            }}
          />
        </div>
      </details>

      <details className="group rounded-[var(--radius-lg)] border border-border-subtle bg-surface-primary">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-semibold text-text-primary sm:px-6">
          Aktivitäten und Einflüsse

          <span
            aria-hidden="true"
            className="text-xl transition group-open:rotate-45"
          >
            +
          </span>
        </summary>

        <div className="border-t border-border-subtle px-4 py-5 sm:px-6">
          <ChipSelector
            name="activityTags"
            label="Was hat deinen Tag geprägt?"
            options={activityOptions}
            defaultValues={values.activityTags}
            emptyOption={{
              label: "Nichts Besonderes",
              emoji: "○",
            }}
          />
        </div>
      </details>

      <details className="group rounded-[var(--radius-lg)] border border-border-subtle bg-surface-primary">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 font-semibold text-text-primary sm:px-6">
          Optionale Notiz

          <span
            aria-hidden="true"
            className="text-xl transition group-open:rotate-45"
          >
            +
          </span>
        </summary>

        <div className="border-t border-border-subtle px-4 py-5 sm:px-6">
          <label
            htmlFor="notes"
            className="sr-only"
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
      </details>

      <div className="sticky bottom-4 z-10 rounded-[var(--radius-lg)] border border-border-subtle bg-surface-primary/95 p-3 shadow-lg backdrop-blur">
        <Button
          type="submit"
          className="min-h-12 w-full justify-center text-base"
        >
          Tageserfassung speichern
        </Button>
      </div>
    </form>
  );
}
