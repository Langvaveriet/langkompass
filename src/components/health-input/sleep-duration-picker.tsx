type SleepDurationPickerProps = {
  defaultValue?: string;
};

const sleepOptions = Array.from(
  { length: 33 },
  (_, index) => 4 + index * 0.25,
);

function formatHours(value: number): string {
  const hours = Math.floor(value);
  const minutes = Math.round((value - hours) * 60);

  if (minutes === 0) {
    return `${hours} Stunden`;
  }

  return `${hours} Std. ${minutes} Min.`;
}

export function SleepDurationPicker({
  defaultValue = "",
}: SleepDurationPickerProps) {
  return (
    <div className="grid gap-2">
      <label
        htmlFor="sleepHours"
        className="text-sm font-semibold text-text-primary"
      >
        Schlafdauer
      </label>

      <select
        id="sleepHours"
        name="sleepHours"
        defaultValue={defaultValue}
        className="min-h-12 w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base text-text-primary outline-none transition focus:border-forest-strong focus:ring-2 focus:ring-forest-soft"
      >
        <option value="">Nicht angeben</option>

        {sleepOptions.map((value) => (
          <option key={value} value={value}>
            {formatHours(value)}
          </option>
        ))}
      </select>
    </div>
  );
}
