import { createLabReport } from "@/app/laborwerte/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fastingStatusLabels } from "@/lib/labs/lab-catalog";

type LabReportFormProps = {
  defaultDate: string;
  defaultTime: string;
  initiallyOpen: boolean;
};

export function LabReportForm({
  defaultDate,
  defaultTime,
  initiallyOpen,
}: LabReportFormProps) {
  return (
    <details
      open={initiallyOpen}
      className="rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised"
    >
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-forest-strong marker:hidden">
        <span>Neue Untersuchung anlegen</span>
        <span aria-hidden="true" className="text-2xl">+</span>
      </summary>
      <form action={createLabReport} className="border-t border-border p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="collectedDate" name="collectedDate" type="date" label="Datum" defaultValue={defaultDate} required />
          <Input id="collectedTime" name="collectedTime" type="time" label="Uhrzeit" defaultValue={defaultTime} required />
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-text-primary">Warst du nüchtern?</legend>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
            {Object.entries(fastingStatusLabels).map(([value, label]) => (
              <label key={value} className="cursor-pointer">
                <input type="radio" name="fastingStatus" value={value} defaultChecked={value === "UNKNOWN"} className="peer sr-only" />
                <span className="flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-surface px-4 text-center text-sm font-semibold text-text-secondary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <details className="mt-5 rounded-[var(--radius-md)] border border-border bg-surface">
          <summary className="flex min-h-12 cursor-pointer list-none items-center px-4 text-sm font-semibold text-forest-strong marker:hidden">
            Weitere Angaben (optional)
          </summary>
          <div className="grid gap-4 border-t border-border p-4">
            <Input id="laboratory" name="laboratory" label="Labor oder Praxis" maxLength={120} />
            <Input id="controlDate" name="controlDate" type="date" label="Geplanter Kontrolltermin" />
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              Arztkommentar
              <textarea name="physicianComment" maxLength={1000} rows={3} className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 text-base font-normal text-text-primary outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-text-primary">
              Eigene Notiz
              <textarea name="notes" maxLength={1000} rows={3} className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 text-base font-normal text-text-primary outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
            </label>
          </div>
        </details>

        <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto">
          Untersuchung anlegen
        </Button>
      </form>
    </details>
  );
}
