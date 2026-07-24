"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

import { addCatalogExercise } from "@/app/training/actions";
import { MuscleAreaIcon } from "@/components/training/muscle-area-icon";
import { exerciseEquipmentLabels } from "@/lib/training/exercise-options";
import {
  exerciseCatalog,
  type ExerciseArea,
} from "@/lib/training/exercise-catalog";

type ExerciseQuickAddProps = {
  existingNames: string[];
};

function normalizedName(name: string) {
  return name.toLocaleLowerCase("de-DE").replace(/\s+/g, " ");
}

function QuickAddButton({
  name,
  equipment,
  exists,
  spriteCatalog,
  spriteColumn,
  spriteRow,
}: {
  name: string;
  equipment: string;
  exists: boolean;
  spriteCatalog: "base" | "extended";
  spriteColumn: number;
  spriteRow: number;
}) {
  const { pending } = useFormStatus();
  const spriteCrop =
    spriteCatalog === "extended"
      ? spriteRow === 3
        ? "inset(5% 5% 14%)"
        : "inset(5%)"
      : spriteRow === 0
        ? "inset(0 6% 4%)"
        : spriteRow === 4
          ? "inset(12% 6% 2%)"
          : "inset(20% 6% 4%)";

  return (
    <button
      type="submit"
      disabled={exists || pending}
      className="flex min-h-28 w-full items-center gap-3 rounded-[var(--radius-md)] border border-border-subtle bg-surface-primary p-3 text-left transition hover:border-forest-strong hover:bg-forest-soft disabled:cursor-default disabled:opacity-55"
    >
      <span
        aria-hidden="true"
        className="block h-24 w-24 shrink-0 bg-no-repeat"
        style={{
          backgroundImage: `url("/training/exercise-catalog-${spriteCatalog === "base" ? "v2" : "extended"}.webp")`,
          backgroundPosition: `${spriteColumn * 25}% ${spriteRow * 25}%`,
          backgroundSize: "500% 500%",
          clipPath: spriteCrop,
        }}
      />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-text-primary">
          {name}
        </span>
        <span className="mt-1 block text-xs text-text-muted">
          {exists
            ? "Bereits vorhanden"
            : pending
              ? "Wird hinzugefügt …"
              : equipment}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="flex h-8 w-8 shrink-0 items-center justify-center self-start rounded-full bg-forest-soft text-xl font-semibold text-forest-strong"
      >
        {exists ? "✓" : "+"}
      </span>
    </button>
  );
}

export function ExerciseQuickAdd({ existingNames }: ExerciseQuickAddProps) {
  const [selectedArea, setSelectedArea] = useState<ExerciseArea>("ARMS");
  const area =
    exerciseCatalog.find((option) => option.value === selectedArea) ??
    exerciseCatalog[0];
  const areaIndex = exerciseCatalog.findIndex(
    (option) => option.value === area.value,
  );
  const existingNameSet = new Set(existingNames);

  return (
    <div className="grid gap-6">
      <div
        role="tablist"
        aria-label="Körperbereich auswählen"
        className="grid grid-cols-3 gap-2 sm:grid-cols-5"
      >
        {exerciseCatalog.map((option) => {
          const selected = option.value === selectedArea;

          return (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setSelectedArea(option.value)}
              className={[
                "flex min-h-28 flex-col items-center justify-center rounded-[var(--radius-md)] border px-2 py-3 text-sm font-semibold transition",
                selected
                  ? "border-forest-strong bg-forest-soft text-forest-strong"
                  : "border-border-subtle bg-surface-primary text-text-muted hover:border-border-strong",
              ].join(" ")}
            >
              <MuscleAreaIcon area={option.value} />
              <span className="mt-1">{option.label}</span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="grid gap-3">
        <div>
          <h3 className="text-lg font-semibold text-text-primary">
            {area.label}
          </h3>
          <p className="mt-1 text-sm text-text-muted">{area.description}</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {area.exercises.map((exercise, exerciseIndex) => {
            const exists = existingNameSet.has(normalizedName(exercise.name));

            return (
              <form key={exercise.key} action={addCatalogExercise}>
                <input
                  type="hidden"
                  name="exerciseKey"
                  value={exercise.key}
                />
                <QuickAddButton
                  name={exercise.name}
                  equipment={exerciseEquipmentLabels[exercise.equipment]}
                  exists={exists}
                  spriteCatalog={exerciseIndex < 5 ? "base" : "extended"}
                  spriteColumn={exerciseIndex % 5}
                  spriteRow={areaIndex}
                />
              </form>
            );
          })}
        </div>
      </div>
    </div>
  );
}
