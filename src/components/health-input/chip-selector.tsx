"use client";

type ChipOption = {
  value: string;
  label: string;
  emoji?: string;
};

type ChipSelectorProps = {
  name: string;
  label: string;
  options: ChipOption[];
  defaultValues?: string[];
};

export function ChipSelector({
  name,
  label,
  options,
  defaultValues = [],
}: ChipSelectorProps) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-semibold text-text-primary">
        {label}
      </legend>

      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="cursor-pointer"
          >
            <input
              type="checkbox"
              name={name}
              value={option.value}
              defaultChecked={defaultValues.includes(option.value)}
              className="peer sr-only"
            />

            <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong bg-surface-primary px-4 py-2 text-sm font-medium text-text-primary transition peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong peer-checked:ring-2 peer-checked:ring-forest-soft">
              {option.emoji ? (
                <span aria-hidden="true">{option.emoji}</span>
              ) : null}

              {option.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
