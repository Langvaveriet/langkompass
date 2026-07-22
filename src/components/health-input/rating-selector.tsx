"use client";

type RatingOption = {
  value: number;
  emoji: string;
  label: string;
};

type RatingSelectorProps = {
  name: string;
  label: string;
  defaultValue?: number | null;
  options: RatingOption[];
};

export function RatingSelector({
  name,
  label,
  defaultValue,
  options,
}: RatingSelectorProps) {
  return (
    <fieldset className="grid gap-3">
      <legend className="text-sm font-semibold text-text-primary">
        {label}
      </legend>

      <div className="grid grid-cols-5 gap-2">
        {options.map((option) => (
          <label
            key={option.value}
            className="cursor-pointer"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              defaultChecked={defaultValue === option.value}
              className="peer sr-only"
            />

            <span className="flex min-h-20 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-2 py-3 text-center transition peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:ring-2 peer-checked:ring-forest-soft">
              <span className="text-2xl" aria-hidden="true">
                {option.emoji}
              </span>

              <span className="text-xs font-medium text-text-muted peer-checked:text-text-primary">
                {option.label}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
