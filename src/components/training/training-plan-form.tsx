"use client";

import { useState } from "react";

import { saveTrainingPlan } from "@/app/training/actions";
import { ExerciseThumbnail } from "@/components/training/exercise-thumbnail";
import { Button } from "@/components/ui/button";
import type { ExerciseVisual } from "@/lib/training/exercise-catalog";

export type TrainingPlanExerciseOption = {
  id: string;
  name: string;
  visual?: ExerciseVisual;
};

export type TrainingPlanFormValues = {
  id?: string;
  name: string;
  exercises: Array<{
    exerciseId: string;
    targetSets: number;
    targetReps: number;
  }>;
};

type TrainingPlanFormProps = {
  exercises: TrainingPlanExerciseOption[];
  values: TrainingPlanFormValues;
};

type ExerciseTarget = {
  targetSets: number;
  targetReps: number;
};

function TargetStepper({
  label,
  accessibleLabel = label,
  value,
  minimum,
  maximum,
  onChange,
}: {
  label: string;
  accessibleLabel?: string;
  value: number;
  minimum: number;
  maximum: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid gap-1">
      <span className="text-xs font-semibold text-text-muted">{label}</span>
      <div className="grid grid-cols-[2.5rem_1fr_2.5rem] overflow-hidden rounded-[var(--radius-md)] border border-border-strong bg-surface-primary">
        <button
          type="button"
          aria-label={`${accessibleLabel} verringern`}
          onClick={() => onChange(Math.max(minimum, value - 1))}
          className="min-h-11 border-r border-border-subtle text-lg font-semibold text-forest-strong"
        >
          −
        </button>
        <span className="flex min-h-11 items-center justify-center text-base font-semibold text-text-primary">
          {value}
        </span>
        <button
          type="button"
          aria-label={`${accessibleLabel} erhöhen`}
          onClick={() => onChange(Math.min(maximum, value + 1))}
          className="min-h-11 border-l border-border-subtle text-lg font-semibold text-forest-strong"
        >
          +
        </button>
      </div>
    </div>
  );
}

export function TrainingPlanForm({
  exercises,
  values,
}: TrainingPlanFormProps) {
  const [exerciseTargets, setExerciseTargets] = useState<
    Record<string, ExerciseTarget>
  >(
    Object.fromEntries(
      values.exercises.map((exercise) => [
        exercise.exerciseId,
        {
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
        },
      ]),
    ),
  );
  const selectedExerciseIds = Object.keys(exerciseTargets);

  function toggleExercise(exerciseId: string) {
    setExerciseTargets((current) => {
      if (current[exerciseId]) {
        const { [exerciseId]: removed, ...remaining } = current;
        void removed;
        return remaining;
      }

      if (Object.keys(current).length >= 20) {
        return current;
      }

      return {
        ...current,
        [exerciseId]: { targetSets: 3, targetReps: 10 },
      };
    });
  }

  function updateTarget(
    exerciseId: string,
    field: keyof ExerciseTarget,
    value: number,
  ) {
    setExerciseTargets((current) => ({
      ...current,
      [exerciseId]: { ...current[exerciseId], [field]: value },
    }));
  }

  return (
    <form action={saveTrainingPlan} className="grid gap-6">
      {values.id ? (
        <input type="hidden" name="trainingPlanId" value={values.id} />
      ) : null}

      <label className="grid gap-2 text-sm font-semibold text-text-primary">
        Name des Trainings
        <input
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={60}
          defaultValue={values.name}
          placeholder="z. B. Oberkörper A"
          className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base font-normal outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft"
        />
      </label>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-text-primary">
          Übungen auswählen
        </legend>
        <p className="text-xs leading-5 text-text-muted">
          {selectedExerciseIds.length} ausgewählt · maximal 20 Übungen
        </p>

        {exercises.length === 0 ? (
          <p className="rounded-[var(--radius-md)] bg-surface-muted p-4 text-sm leading-6 text-text-muted">
            Lege zuerst Übungen in deiner Bibliothek an.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {exercises.map((exercise) => {
              const selected = selectedExerciseIds.includes(exercise.id);

              return (
                <label
                  key={exercise.id}
                  className={[
                    "relative flex min-h-20 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border p-2 transition",
                    selected
                      ? "border-forest-strong bg-forest-soft"
                      : "border-border-subtle bg-surface-primary",
                  ].join(" ")}
                >
                  <input
                    type="checkbox"
                    name="exerciseIds"
                    value={exercise.id}
                    checked={selected}
                    disabled={
                      selectedExerciseIds.length >= 20 && !selected
                    }
                    onChange={() => toggleExercise(exercise.id)}
                    className="sr-only"
                  />
                  <ExerciseThumbnail
                    name={exercise.name}
                    visual={exercise.visual}
                  />
                  <span className="min-w-0 flex-1 text-sm font-semibold leading-5 text-text-primary">
                    {exercise.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold",
                      selected
                        ? "bg-forest-strong text-surface"
                        : "bg-surface-muted text-text-muted",
                    ].join(" ")}
                  >
                    {selected ? "✓" : "+"}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </fieldset>

      {selectedExerciseIds.length > 0 ? (
        <fieldset className="grid gap-3">
          <legend className="text-sm font-semibold text-text-primary">
            Satzvorgaben
          </legend>
          <p className="text-xs leading-5 text-text-muted">
            Diese Werte werden beim Training automatisch vorgeschlagen.
          </p>
          <div className="grid gap-3">
            {selectedExerciseIds.map((exerciseId) => {
              const exercise = exercises.find(({ id }) => id === exerciseId);
              const target = exerciseTargets[exerciseId];

              if (!exercise || !target) {
                return null;
              }

              return (
                <div
                  key={exerciseId}
                  className="grid gap-3 rounded-[var(--radius-md)] bg-surface-muted p-3 sm:grid-cols-[minmax(10rem,1fr)_8rem_8rem] sm:items-end"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <ExerciseThumbnail
                      name={exercise.name}
                      visual={exercise.visual}
                    />
                    <span className="text-sm font-semibold text-text-primary">
                      {exercise.name}
                    </span>
                  </div>
                  <input
                    type="hidden"
                    name={`targetSets:${exerciseId}`}
                    value={target.targetSets}
                  />
                  <input
                    type="hidden"
                    name={`targetReps:${exerciseId}`}
                    value={target.targetReps}
                  />
                  <TargetStepper
                    label="Sätze"
                    accessibleLabel={`Sätze für ${exercise.name}`}
                    value={target.targetSets}
                    minimum={1}
                    maximum={10}
                    onChange={(value) =>
                      updateTarget(exerciseId, "targetSets", value)
                    }
                  />
                  <TargetStepper
                    label="Wiederholungen"
                    accessibleLabel={`Wiederholungen für ${exercise.name}`}
                    value={target.targetReps}
                    minimum={1}
                    maximum={100}
                    onChange={(value) =>
                      updateTarget(exerciseId, "targetReps", value)
                    }
                  />
                </div>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <Button
        type="submit"
        disabled={selectedExerciseIds.length === 0}
        className="w-full sm:w-auto"
      >
        {values.id ? "Trainingsplan speichern" : "Trainingsplan anlegen"}
      </Button>
    </form>
  );
}
