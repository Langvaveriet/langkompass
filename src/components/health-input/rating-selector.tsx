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

      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
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

            <span className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-1 py-2 text-center transition peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:ring-2 peer-checked:ring-forest-soft sm:min-h-20 sm:px-2 sm:py-3">
              <span className="text-xl sm:text-2xl" aria-hidden="true">
                {option.emoji}
              </span>

              <span className="hidden text-xs font-medium text-text-muted peer-checked:text-text-primary sm:block">
                {option.label}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
