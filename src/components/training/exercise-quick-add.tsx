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

const exerciseSpriteRows = [
  { start: 24, height: 246 },
  { start: 286, height: 260 },
  { start: 558, height: 230 },
  { start: 804, height: 208 },
  { start: 1014, height: 218 },
] as const;

const spriteImageSize = 1254;
const spriteCellSize = spriteImageSize / 5;
const thumbnailSize = 96;
const spriteScale = thumbnailSize / spriteCellSize;

function normalizedName(name: string) {
  return name.toLocaleLowerCase("de-DE").replace(/\s+/g, " ");
}

function QuickAddButton({
  name,
  equipment,
  exists,
  spriteColumn,
  spriteRow,
}: {
  name: string;
  equipment: string;
  exists: boolean;
  spriteColumn: number;
  spriteRow: number;
}) {
  const { pending } = useFormStatus();
  const row = exerciseSpriteRows[spriteRow];

  return (
    <button
      type="submit"
      disabled={exists || pending}
      className="flex min-h-28 w-full items-center gap-3 rounded-[var(--radius-md)] border border-border-subtle bg-surface-primary p-3 text-left transition hover:border-forest-strong hover:bg-forest-soft disabled:cursor-default disabled:opacity-55"
    >
      <span
        aria-hidden="true"
        className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[var(--radius-sm)] bg-[#faf8f3]"
      >
        <span
          className="block w-24 shrink-0 bg-no-repeat"
          style={{
            height: `${row.height * spriteScale}px`,
            backgroundImage: 'url("/training/exercise-catalog.webp")',
            backgroundPosition: `${-spriteColumn * thumbnailSize}px ${-row.start * spriteScale}px`,
            backgroundSize: `${spriteImageSize * spriteScale}px ${spriteImageSize * spriteScale}px`,
          }}
        />
      </span>
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
                  spriteColumn={exerciseIndex}
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
