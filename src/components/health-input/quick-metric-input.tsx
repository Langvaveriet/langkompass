"use client";

import { useState } from "react";

type QuickMetricOption = {
  value: string;
  label: string;
};

type QuickMetricInputProps = {
  name: string;
  label: string;
  unit: string;
  defaultValue?: string;
  options: QuickMetricOption[];
  min: number;
  max: number;
  step: number;
  inputMode?: "numeric" | "decimal";
  description?: string;
};

export function QuickMetricInput({
  name,
  label,
  unit,
  defaultValue = "",
  options,
  min,
  max,
  step,
  inputMode = "decimal",
  description,
}: QuickMetricInputProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="grid gap-3">
      <div>
        <label
          htmlFor={name}
          className="text-sm font-semibold text-text-primary"
        >
          {label}
        </label>
        {description ? (
          <p className="mt-1 text-xs leading-5 text-text-muted">
            {description}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = Number(value) === Number(option.value);

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => setValue(option.value)}
              className={[
                "min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition",
                selected
                  ? "border-forest-strong bg-forest-soft text-forest-strong ring-2 ring-forest-soft"
                  : "border-border-strong bg-surface-primary text-text-primary hover:border-forest-strong",
              ].join(" ")}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      <div className="relative">
        <input
          id={name}
          name={name}
          type="number"
          inputMode={inputMode}
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="Andere Angabe"
          className="min-h-12 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 pr-20 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-forest-strong focus:ring-2 focus:ring-forest-soft"
        />
        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-text-muted">
          {unit}
        </span>
      </div>

      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          className="min-h-10 justify-self-start rounded-full px-3 text-xs font-semibold text-text-muted"
        >
          Angabe entfernen
        </button>
      ) : null}
    </div>
  );
}
