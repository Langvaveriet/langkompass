"use client";

import { useState } from "react";

type ChipOption = {
  value: string;
  label: string;
  emoji?: string;
};

type EmptyOption = {
  label: string;
  emoji?: string;
};

type ChipSelectorProps = {
  name: string;
  label: string;
  options: ChipOption[];
  defaultValues?: string[];
  emptyOption?: EmptyOption;
};

export function ChipSelector({
  name,
  label,
  options,
  defaultValues = [],
  emptyOption,
}: ChipSelectorProps) {
  const allowedValues = new Set(options.map((option) => option.value));

  const [selectedValues, setSelectedValues] = useState<string[]>(
    defaultValues.filter((value) => allowedValues.has(value)),
  );

  const selectedSet = new Set(selectedValues);
  const nothingSelected = selectedValues.length === 0;

  function toggleValue(value: string) {
    setSelectedValues((currentValues) =>
      currentValues.includes(value)
        ? currentValues.filter((currentValue) => currentValue !== value)
        : [...currentValues, value],
    );
  }

  function clearSelection() {
    setSelectedValues([]);
  }

  return (
    <fieldset className="grid gap-4">
      <div className="flex items-center justify-between gap-4">
        <legend className="text-sm font-semibold text-text-primary">
          {label}
        </legend>

        <span
          aria-live="polite"
          className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text-muted"
        >
          {selectedValues.length === 0
            ? "Keine Auswahl"
            : `${selectedValues.length} ausgewählt`}
        </span>
      </div>

      {selectedValues.map((value) => (
        <input
          key={value}
          type="hidden"
          name={name}
          value={value}
        />
      ))}

      <div className="flex flex-wrap gap-2">
        {emptyOption ? (
          <button
            type="button"
            aria-pressed={nothingSelected}
            onClick={clearSelection}
            className={[
              "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
              nothingSelected
                ? "border-forest-strong bg-forest-soft text-forest-strong ring-2 ring-forest-soft"
                : "border-border-strong bg-surface-primary text-text-primary hover:border-forest-strong",
            ].join(" ")}
          >
            {emptyOption.emoji ? (
              <span aria-hidden="true">{emptyOption.emoji}</span>
            ) : null}

            {emptyOption.label}
          </button>
        ) : null}

        {options.map((option) => {
          const selected = selectedSet.has(option.value);

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => toggleValue(option.value)}
              className={[
                "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition",
                selected
                  ? "border-forest-strong bg-forest-soft text-forest-strong ring-2 ring-forest-soft"
                  : "border-border-strong bg-surface-primary text-text-primary hover:border-forest-strong hover:bg-surface-muted",
              ].join(" ")}
            >
              {option.emoji ? (
                <span aria-hidden="true">{option.emoji}</span>
              ) : null}

              {option.label}

              {selected ? (
                <span aria-hidden="true" className="font-bold">
                  ✓
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
