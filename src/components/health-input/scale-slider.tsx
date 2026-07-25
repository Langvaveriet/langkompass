"use client";

import { useState } from "react";

type ScaleSliderProps = {
  name: string;
  label: string;
  defaultValue?: number | null;
  minimumLabel: string;
  maximumLabel: string;
  allowEmpty?: boolean;
};

export function ScaleSlider({
  name,
  label,
  defaultValue = 0,
  minimumLabel,
  maximumLabel,
  allowEmpty = false,
}: ScaleSliderProps) {
  const [value, setValue] = useState<number | null>(
    defaultValue ?? (allowEmpty ? null : 0),
  );

  return (
    <div className="grid gap-3">
      <div className="flex items-center justify-between gap-4">
        <label
          htmlFor={name}
          className="text-sm font-semibold text-text-primary"
        >
          {label}
        </label>

        <output
          htmlFor={name}
          className="flex min-h-10 min-w-10 items-center justify-center rounded-full bg-forest-soft px-3 text-sm font-bold text-forest-strong"
        >
          {value ?? "–"}
        </output>
      </div>

      <input
        id={name}
        name={value === null ? undefined : name}
        type="range"
        min="0"
        max="10"
        step="1"
        value={value ?? 0}
        onChange={(event) => setValue(Number(event.target.value))}
        className="h-11 w-full cursor-pointer accent-[var(--color-forest-strong)]"
      />

      <div className="flex justify-between gap-4 text-xs text-text-muted">
        <span>{minimumLabel}</span>
        <span className="text-right">{maximumLabel}</span>
      </div>

      {allowEmpty ? (
        <button
          type="button"
          onClick={() => setValue(null)}
          className="min-h-10 justify-self-start rounded-full px-3 text-xs font-semibold text-text-muted"
        >
          {value === null ? "Noch nicht angegeben" : "Angabe entfernen"}
        </button>
      ) : null}
    </div>
  );
}
