"use client";

import { useState } from "react";

type WeightPickerProps = {
  defaultValue?: string;
  suggestedValue?: string;
  defaultTime: string;
};

function adjustedWeight(value: string, suggestedValue: string, delta: number) {
  const sourceValue = value || suggestedValue;

  if (!sourceValue) {
    return "";
  }

  const baseValue = Number(sourceValue);

  if (!Number.isFinite(baseValue)) {
    return "";
  }

  return (Math.round((baseValue + delta) * 10) / 10).toFixed(1);
}

export function WeightPicker({
  defaultValue = "",
  suggestedValue = "",
  defaultTime,
}: WeightPickerProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <div className="grid gap-3">
      <div>
        <label
          htmlFor="weightKg"
          className="text-sm font-semibold text-text-primary"
        >
          Gewicht
        </label>
        <p className="mt-1 text-xs leading-5 text-text-muted">
          Optional. Kleine Schwankungen sind normal; entscheidend ist der
          langfristige Verlauf.
        </p>
      </div>

      <div className="flex items-stretch gap-2">
        <button
          type="button"
          onClick={() =>
            setValue(adjustedWeight(value, suggestedValue, -0.1))
          }
          className="min-h-12 min-w-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised text-lg font-semibold text-text-primary"
          aria-label="Gewicht um 0,1 Kilogramm verringern"
        >
          −
        </button>

        <div className="relative min-w-0 flex-1">
          <input
            id="weightKg"
            name="weightKg"
            type="number"
            inputMode="decimal"
            min="20"
            max="400"
            step="0.1"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="z. B. 82,4"
            className="min-h-12 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 pr-12 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-forest-strong focus:ring-2 focus:ring-forest-soft"
          />
          <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-text-muted">
            kg
          </span>
        </div>

        <button
          type="button"
          onClick={() =>
            setValue(adjustedWeight(value, suggestedValue, 0.1))
          }
          className="min-h-12 min-w-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised text-lg font-semibold text-text-primary"
          aria-label="Gewicht um 0,1 Kilogramm erhöhen"
        >
          +
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {!defaultValue && suggestedValue ? (
          <button
            type="button"
            onClick={() => setValue(suggestedValue)}
            className="min-h-10 rounded-full border border-border-strong bg-surface-raised px-4 text-xs font-semibold text-forest-strong"
          >
            Wie zuletzt: {suggestedValue.replace(".", ",")} kg
          </button>
        ) : null}

        {value ? (
          <button
            type="button"
            onClick={() => setValue("")}
            className="min-h-10 rounded-full px-3 text-xs font-semibold text-text-muted"
          >
            Angabe entfernen
          </button>
        ) : null}
      </div>

      <details className="rounded-[var(--radius-md)] border border-border-subtle bg-surface-primary px-4 py-3">
        <summary className="cursor-pointer text-xs font-semibold text-text-muted">
          Messzeit: {defaultTime} Uhr
        </summary>
        <label
          htmlFor="weightMeasuredTime"
          className="mt-3 grid gap-2 text-xs font-semibold text-text-primary"
        >
          Uhrzeit anpassen
          <input
            id="weightMeasuredTime"
            name="weightMeasuredTime"
            type="time"
            defaultValue={defaultTime}
            className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 text-base font-normal text-text-primary"
          />
        </label>
      </details>
    </div>
  );
}
