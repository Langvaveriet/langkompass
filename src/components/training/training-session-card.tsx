"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";

import {
  addTrainingSet,
  completeTrainingSession,
  deleteTrainingSet,
  startTrainingSession,
} from "@/app/training/actions";
import { ExerciseThumbnail } from "@/components/training/exercise-thumbnail";
import { Button } from "@/components/ui/button";
import type { ExerciseVisual } from "@/lib/training/exercise-catalog";

type ExerciseOption = {
  id: string;
  name: string;
  visual?: ExerciseVisual;
  previousWeightKg?: string | null;
};

type TrainingPlanOption = {
  id: string;
  name: string;
  exerciseCount: number;
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
  planName: string | null;
  startedAtLabel: string;
  sets: LoggedSet[];
};

type TrainingSessionCardProps = {
  exercises: ExerciseOption[];
  plans: TrainingPlanOption[];
  session: ActiveTrainingSession | null;
};

function previousWeightForExercise(
  sets: LoggedSet[],
  exercise: ExerciseOption | undefined,
): number {
  const previousSet = sets.findLast(
    (set) => set.exerciseId === exercise?.id,
  );
  const parsedWeight = Number(
    previousSet
      ? previousSet.weightKg ?? 0
      : exercise?.previousWeightKg ?? 0,
  );

  return Number.isFinite(parsedWeight) ? parsedWeight : 0;
}

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
  plans,
  session,
}: TrainingSessionCardProps) {
  const initialExerciseId =
    session?.sets.at(-1)?.exerciseId ?? exercises[0]?.id ?? "";
  const [repetitions, setRepetitions] = useState(10);
  const [weightKg, setWeightKg] = useState(() =>
    previousWeightForExercise(
      session?.sets ?? [],
      exercises.find((exercise) => exercise.id === initialExerciseId),
    ),
  );
  const [effort, setEffort] = useState<number | null>(null);
  const [selectedExerciseId, setSelectedExerciseId] =
    useState(initialExerciseId);

  function selectExercise(exerciseId: string) {
    setSelectedExerciseId(exerciseId);
    setWeightKg(
      previousWeightForExercise(
        session?.sets ?? [],
        exercises.find((exercise) => exercise.id === exerciseId),
      ),
    );
  }

  if (!session) {
    return (
      <div className="grid gap-5">
        <div>
          <p className="font-semibold text-text-primary">
            Bereit für deine nächste Einheit?
          </p>
          <p className="mt-1 text-sm leading-6 text-text-muted">
            Wähle einen Trainingsplan. Danach erscheinen nur die dafür
            vorgesehenen Übungen.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
            <p className="font-semibold text-text-primary">
              Noch kein Trainingsplan vorhanden
            </p>
            <p className="mt-1 text-sm leading-6 text-text-muted">
              Stelle zuerst eine wiederverwendbare Einheit aus deinen Übungen
              zusammen.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {plans.map((plan) => (
              <form key={plan.id} action={startTrainingSession}>
                <input type="hidden" name="trainingPlanId" value={plan.id} />
                <button
                  type="submit"
                  className="flex min-h-20 w-full items-center justify-between gap-4 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 py-3 text-left transition hover:border-forest-strong hover:bg-forest-soft"
                >
                  <span>
                    <span className="block font-semibold text-text-primary">
                      {plan.name}
                    </span>
                    <span className="mt-1 block text-xs text-text-muted">
                      {plan.exerciseCount}{" "}
                      {plan.exerciseCount === 1 ? "Übung" : "Übungen"}
                    </span>
                  </span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-soft text-xl font-semibold text-forest-strong">
                    →
                  </span>
                </button>
              </form>
            ))}
          </div>
        )}

        <Link
          href="/training/plaene"
          className="inline-flex min-h-11 items-center font-semibold text-forest-strong"
        >
          {plans.length === 0
            ? "Ersten Trainingsplan anlegen →"
            : "Trainingspläne verwalten →"}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-forest-strong">
            {session.planName ?? "Training"} läuft
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

          <fieldset className="grid gap-2">
            <legend className="text-sm font-semibold text-text-primary">
              Übung
            </legend>
            <input
              type="hidden"
              name="exerciseId"
              value={selectedExerciseId}
            />
            <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-2">
              {exercises.map((exercise) => {
                const selected = exercise.id === selectedExerciseId;

                return (
                  <button
                    key={exercise.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => selectExercise(exercise.id)}
                    className={[
                      "flex min-h-16 min-w-36 shrink-0 snap-start items-center gap-2 rounded-[var(--radius-md)] border py-2 pl-2 pr-4 text-left text-sm font-semibold transition",
                      selected
                        ? "border-forest-strong bg-forest-soft text-forest-strong"
                        : "border-border-strong bg-surface-primary text-text-primary",
                    ].join(" ")}
                  >
                    <ExerciseThumbnail
                      name={exercise.name}
                      visual={exercise.visual}
                    />
                    <span className="max-w-28 leading-5">{exercise.name}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-xs text-text-muted">
              Für weitere Übungen seitlich wischen.
            </p>
          </fieldset>

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
