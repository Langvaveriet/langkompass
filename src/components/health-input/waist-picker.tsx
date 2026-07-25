"use client";

import { useState } from "react";

type WaistPickerProps = {
  defaultValue?: string;
  suggestedValue?: string;
  defaultTime: string;
};

function adjustedValue(value: string, suggestedValue: string, delta: number) {
  const sourceValue = value || suggestedValue;
  const baseValue = Number(sourceValue);

  if (!Number.isFinite(baseValue)) {
    return "";
  }

  return (Math.round((baseValue + delta) * 10) / 10).toFixed(1);
}

export function WaistPicker({
  defaultValue = "",
  suggestedValue = "",
  defaultTime,
}: WaistPickerProps) {
  const [value, setValue] = useState(defaultValue);

  return (
    <details className="rounded-[var(--radius-md)] border border-border-subtle bg-surface-primary">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-text-primary marker:hidden">
        <span>
          Bauchumfang
          <span className="ml-2 font-normal text-text-muted">
            {value ? `${value.replace(".", ",")} cm` : "optional"}
          </span>
        </span>
        <span aria-hidden="true">+</span>
      </summary>

      <div className="grid gap-3 border-t border-border-subtle p-4">
        <p className="text-xs leading-5 text-text-muted">
          Am besten morgens auf Nabelhöhe messen. Für den Verlauf genügt eine
          gelegentliche Messung.
        </p>

        <div className="flex items-stretch gap-2">
          <button
            type="button"
            onClick={() => setValue(adjustedValue(value, suggestedValue, -0.5))}
            className="min-h-12 min-w-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised text-lg font-semibold text-text-primary"
            aria-label="Bauchumfang um 0,5 Zentimeter verringern"
          >
            −
          </button>

          <div className="relative min-w-0 flex-1">
            <input
              id="waistCm"
              name="waistCm"
              type="number"
              inputMode="decimal"
              min="30"
              max="300"
              step="0.1"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder="z. B. 96,5"
              className="min-h-12 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 pr-12 text-base text-text-primary outline-none transition placeholder:text-text-muted focus:border-forest-strong focus:ring-2 focus:ring-forest-soft"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-sm text-text-muted">
              cm
            </span>
          </div>

          <button
            type="button"
            onClick={() => setValue(adjustedValue(value, suggestedValue, 0.5))}
            className="min-h-12 min-w-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised text-lg font-semibold text-text-primary"
            aria-label="Bauchumfang um 0,5 Zentimeter erhöhen"
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
              Wie zuletzt: {suggestedValue.replace(".", ",")} cm
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

        <label
          htmlFor="waistMeasuredTime"
          className="grid gap-2 text-xs font-semibold text-text-primary"
        >
          Messzeit
          <input
            id="waistMeasuredTime"
            name="waistMeasuredTime"
            type="time"
            defaultValue={defaultTime}
            className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 text-base font-normal text-text-primary"
          />
        </label>
      </div>
    </details>
  );
}
