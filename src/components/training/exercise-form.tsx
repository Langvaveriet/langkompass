"use client";

import { useState } from "react";

import { saveExercise } from "@/app/training/actions";
import { Button } from "@/components/ui/button";
import type {
  ExerciseCategory,
  ExerciseEquipment,
  MuscleGroup,
} from "@/generated/prisma/enums";
import {
  exerciseCategoryLabels,
  exerciseCategoryValues,
  exerciseEquipmentLabels,
  exerciseEquipmentValues,
  muscleGroupLabels,
  muscleGroupValues,
} from "@/lib/training/exercise-options";

export type ExerciseFormValues = {
  id?: string;
  name: string;
  category: ExerciseCategory;
  equipment: ExerciseEquipment;
  muscleGroups: MuscleGroup[];
  notes: string;
};

type ExerciseFormProps = {
  values: ExerciseFormValues;
};

export function ExerciseForm({ values }: ExerciseFormProps) {
  const [selectedMuscleGroups, setSelectedMuscleGroups] = useState(
    values.muscleGroups,
  );

  function toggleMuscleGroup(muscleGroup: MuscleGroup) {
    setSelectedMuscleGroups((current) =>
      current.includes(muscleGroup)
        ? current.filter((value) => value !== muscleGroup)
        : current.length < 4
          ? [...current, muscleGroup]
          : current,
    );
  }

  return (
    <form action={saveExercise} className="grid gap-6">
      {values.id ? (
        <input type="hidden" name="exerciseId" value={values.id} />
      ) : null}

      <div className="grid gap-2">
        <label
          htmlFor="exercise-name"
          className="text-sm font-semibold text-text-primary"
        >
          Name der Übung
        </label>
        <input
          id="exercise-name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={80}
          defaultValue={values.name}
          placeholder="z. B. Beinpresse"
          className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base text-text-primary outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft"
        />
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-text-primary">
          Trainingsart
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {exerciseCategoryValues.map((category) => (
            <label
              key={category}
              className="flex min-h-12 cursor-pointer items-center justify-center rounded-full border border-border-strong bg-surface-raised px-3 text-center text-sm font-semibold text-text-primary has-[:checked]:border-forest-strong has-[:checked]:bg-forest-soft has-[:checked]:text-forest-strong"
            >
              <input
                type="radio"
                name="category"
                value={category}
                defaultChecked={values.category === category}
                className="sr-only"
              />
              {exerciseCategoryLabels[category]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label
          htmlFor="exercise-equipment"
          className="text-sm font-semibold text-text-primary"
        >
          Gerät oder Hilfsmittel
        </label>
        <select
          id="exercise-equipment"
          name="equipment"
          defaultValue={values.equipment}
          className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base text-text-primary outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft"
        >
          {exerciseEquipmentValues.map((equipment) => (
            <option key={equipment} value={equipment}>
              {exerciseEquipmentLabels[equipment]}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-text-primary">
          Muskelgruppen
        </legend>
        <p className="text-xs leading-5 text-text-muted">
          Wähle bis zu vier passende Bereiche.
        </p>
        <div className="flex flex-wrap gap-2">
          {muscleGroupValues.map((muscleGroup) => (
            <label
              key={muscleGroup}
              className="flex min-h-10 cursor-pointer items-center rounded-full border border-border-strong bg-surface-raised px-4 text-xs font-semibold text-text-primary has-[:checked]:border-forest-strong has-[:checked]:bg-forest-soft has-[:checked]:text-forest-strong has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45"
            >
              <input
                type="checkbox"
                name="muscleGroups"
                value={muscleGroup}
                checked={selectedMuscleGroups.includes(muscleGroup)}
                disabled={
                  selectedMuscleGroups.length >= 4 &&
                  !selectedMuscleGroups.includes(muscleGroup)
                }
                onChange={() => toggleMuscleGroup(muscleGroup)}
                className="sr-only"
              />
              {muscleGroupLabels[muscleGroup]}
            </label>
          ))}
        </div>
      </fieldset>

      <details className="rounded-[var(--radius-md)] border border-border-subtle bg-surface-primary px-4 py-3">
        <summary className="cursor-pointer text-sm font-semibold text-text-primary">
          Optionalen Hinweis ergänzen
        </summary>
        <label
          htmlFor="exercise-notes"
          className="mt-4 grid gap-2 text-sm font-semibold text-text-primary"
        >
          Persönlicher Hinweis
          <textarea
            id="exercise-notes"
            name="notes"
            rows={3}
            maxLength={500}
            defaultValue={values.notes}
            placeholder="z. B. Sitzposition oder gelenkschonende Variante"
            className="rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 text-base font-normal text-text-primary outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft"
          />
        </label>
      </details>

      <Button type="submit" className="min-h-12 justify-center">
        {values.id ? "Änderungen speichern" : "Übung hinzufügen"}
      </Button>
    </form>
  );
}
