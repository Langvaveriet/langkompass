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
  exerciseIds: string[];
};

type TrainingPlanFormProps = {
  exercises: TrainingPlanExerciseOption[];
  values: TrainingPlanFormValues;
};

export function TrainingPlanForm({
  exercises,
  values,
}: TrainingPlanFormProps) {
  const [selectedExerciseIds, setSelectedExerciseIds] = useState(
    values.exerciseIds,
  );

  function toggleExercise(exerciseId: string) {
    setSelectedExerciseIds((current) =>
      current.includes(exerciseId)
        ? current.filter((id) => id !== exerciseId)
        : current.length < 20
          ? [...current, exerciseId]
          : current,
    );
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
