"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import {
  addTrainingSet,
  completeTrainingSession,
  deleteTrainingSet,
  startTrainingSession,
} from "@/app/training/actions";
import { Button } from "@/components/ui/button";

type ExerciseOption = {
  id: string;
  name: string;
};

type LoggedSet = {
  id: string;
  exerciseId: string;
  exerciseName: string;
  setNumber: number;
  repetitions: number;
  weightKg: string | null;
  effort: number | null;
};

type ActiveTrainingSession = {
  id: string;
  startedAtLabel: string;
  sets: LoggedSet[];
};

type TrainingSessionCardProps = {
  exercises: ExerciseOption[];
  session: ActiveTrainingSession | null;
};

function SubmitButton({ children }: { children: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Wird gespeichert …" : children}
    </Button>
  );
}

function Stepper({
  label,
  name,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (value: number) => void;
}) {
  const digits = (step.toString().split(".")[1] ?? "").length;

  function adjust(direction: -1 | 1) {
    const next = Math.min(max, Math.max(min, value + direction * step));
    onChange(Number(next.toFixed(digits)));
  }

  return (
    <fieldset className="grid gap-2">
      <legend className="text-sm font-semibold text-text-primary">
        {label}
      </legend>
      <div className="grid grid-cols-[3rem_1fr_3rem] overflow-hidden rounded-[var(--radius-md)] border border-border-strong bg-surface-primary">
        <button
          type="button"
          onClick={() => adjust(-1)}
          className="min-h-12 border-r border-border-subtle text-xl font-semibold text-forest-strong"
          aria-label={`${label} verringern`}
        >
          −
        </button>
        <label className="relative flex min-h-12 items-center justify-center">
          <span className="sr-only">{label}</span>
          <input
            name={name}
            type="number"
            inputMode="decimal"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
            className="w-full bg-transparent px-2 text-center text-lg font-semibold text-text-primary outline-none"
          />
          {unit ? (
            <span className="pointer-events-none absolute right-2 text-xs text-text-muted">
              {unit}
            </span>
          ) : null}
        </label>
        <button
          type="button"
          onClick={() => adjust(1)}
          className="min-h-12 border-l border-border-subtle text-xl font-semibold text-forest-strong"
          aria-label={`${label} erhöhen`}
        >
          +
        </button>
      </div>
    </fieldset>
  );
}

export function TrainingSessionCard({
  exercises,
  session,
}: TrainingSessionCardProps) {
  const [repetitions, setRepetitions] = useState(10);
  const [weightKg, setWeightKg] = useState(0);
  const [effort, setEffort] = useState<number | null>(null);

  if (!session) {
    return (
      <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div>
          <p className="font-semibold text-text-primary">
            Bereit für deine nächste Einheit?
          </p>
          <p className="mt-1 text-sm leading-6 text-text-muted">
            Starte das Training und protokolliere Sätze direkt während der
            Einheit.
          </p>
        </div>
        <form action={startTrainingSession}>
          <SubmitButton>Training starten</SubmitButton>
        </form>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-forest-strong">
            Training läuft
          </p>
          <p className="mt-1 font-semibold text-text-primary">
            Gestartet um {session.startedAtLabel} Uhr · {session.sets.length}{" "}
            {session.sets.length === 1 ? "Satz" : "Sätze"}
          </p>
        </div>
        <form action={completeTrainingSession}>
          <input type="hidden" name="trainingSessionId" value={session.id} />
          <Button type="submit" variant="secondary" size="sm">
            Training abschließen
          </Button>
        </form>
      </div>

      {exercises.length === 0 ? (
        <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
          <p className="font-semibold text-text-primary">
            Noch keine Übung vorhanden
          </p>
          <p className="mt-1 text-sm leading-6 text-text-muted">
            Ergänze zuerst eine Übung in deiner Bibliothek. Die laufende
            Einheit bleibt geöffnet.
          </p>
        </div>
      ) : (
        <form action={addTrainingSet} className="grid gap-5">
          <input type="hidden" name="trainingSessionId" value={session.id} />

          <label className="grid gap-2 text-sm font-semibold text-text-primary">
            Übung
            <select
              name="exerciseId"
              className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base font-normal outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft"
            >
              {exercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
          </label>

          <div className="grid grid-cols-2 gap-3">
            <Stepper
              label="Wiederholungen"
              name="repetitions"
              value={repetitions}
              min={1}
              max={1000}
              step={1}
              onChange={setRepetitions}
            />
            <Stepper
              label="Gewicht"
              name="weightKg"
              value={weightKg}
              min={0}
              max={2000}
              step={2.5}
              unit="kg"
              onChange={setWeightKg}
            />
          </div>

          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold text-text-primary">
              Anstrengung optional
            </legend>
            <input type="hidden" name="effort" value={effort ?? ""} />
            <div className="flex flex-wrap gap-2">
              {[6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEffort(effort === value ? null : value)}
                  aria-pressed={effort === value}
                  className={[
                    "min-h-10 min-w-10 rounded-full border px-3 text-sm font-semibold",
                    effort === value
                      ? "border-forest-strong bg-forest-soft text-forest-strong"
                      : "border-border-strong bg-surface-primary text-text-muted",
                  ].join(" ")}
                >
                  {value}
                </button>
              ))}
            </div>
          </fieldset>

          <SubmitButton>Satz speichern</SubmitButton>
        </form>
      )}

      {session.sets.length > 0 ? (
        <div className="grid gap-2 border-t border-border-subtle pt-5">
          <h3 className="font-semibold text-text-primary">Gespeicherte Sätze</h3>
          <ul className="grid gap-2">
            {session.sets.map((set) => (
              <li
                key={set.id}
                className="flex items-center justify-between gap-3 rounded-[var(--radius-md)] bg-surface-muted px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-text-primary">
                    {set.exerciseName} · Satz {set.setNumber}
                  </p>
                  <p className="mt-1 text-xs text-text-muted">
                    {set.repetitions} Wdh.
                    {set.weightKg ? ` · ${set.weightKg} kg` : " · Körpergewicht"}
                    {set.effort ? ` · Anstrengung ${set.effort}/10` : ""}
                  </p>
                </div>
                <form action={deleteTrainingSet}>
                  <input type="hidden" name="trainingSetId" value={set.id} />
                  <button
                    type="submit"
                    className="min-h-10 px-2 text-xs font-semibold text-text-muted hover:text-forest-strong"
                  >
                    Entfernen
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
