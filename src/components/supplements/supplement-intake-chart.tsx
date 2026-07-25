type DailyCount = {
  key: string;
  label: string;
  count: number;
};

export function SupplementIntakeChart({ days }: { days: DailyCount[] }) {
  const maximum = Math.max(1, ...days.map(({ count }) => count));

  return (
    <div className="mt-5 overflow-x-auto pb-2">
      <ul className="flex min-w-max items-end gap-2" aria-label="Dokumentierte Einnahmen nach Tag">
        {days.map((day) => (
          <li key={day.key} className="grid w-11 justify-items-center gap-2">
            <span className="text-xs font-semibold text-text-secondary">{day.count}</span>
            <span className="flex h-24 w-8 items-end overflow-hidden rounded-full bg-surface-muted" title={`${day.label}: ${day.count} Einnahmen`}>
              <span className="w-full rounded-full bg-forest-strong" style={{ height: day.count === 0 ? 0 : `${Math.max(12, (day.count / maximum) * 100)}%` }} />
            </span>
            <span className="text-[0.65rem] text-text-muted">{day.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
