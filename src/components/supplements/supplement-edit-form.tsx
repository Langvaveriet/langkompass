import { setSupplementArchived, updateSupplement } from "@/app/supplemente/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  SupplementDoseUnit,
  SupplementForm,
  SupplementReason,
} from "@/generated/prisma/enums";
import {
  supplementDoseUnitLabels,
  supplementDoseUnits,
  supplementFormLabels,
  supplementForms,
  supplementReasonLabels,
  supplementReasons,
} from "@/lib/supplements/supplement-options";

type SupplementEditFormProps = {
  supplement: {
    id: string;
    name: string;
    brand: string | null;
    form: SupplementForm;
    defaultDose: { toString(): string };
    doseUnit: SupplementDoseUnit;
    reason: SupplementReason;
    notes: string | null;
  };
};

export function SupplementEditForm({ supplement }: SupplementEditFormProps) {
  return (
    <details className="mt-3 rounded-[var(--radius-md)] border border-border bg-surface">
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold text-forest-strong marker:hidden">
        <span>Präparat bearbeiten</span>
        <span aria-hidden="true">›</span>
      </summary>
      <div className="border-t border-border p-4">
        <form action={updateSupplement}>
          <input type="hidden" name="supplementId" value={supplement.id} />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input id={`edit-name-${supplement.id}`} name="name" label="Produktname" defaultValue={supplement.name} minLength={2} maxLength={100} required />
            <Input id={`edit-brand-${supplement.id}`} name="brand" label="Hersteller (optional)" defaultValue={supplement.brand ?? ""} maxLength={100} />
          </div>
          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-text-primary">Darreichungsform</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {supplementForms.map((form) => (
                <label key={form} className="cursor-pointer">
                  <input type="radio" name="form" value={form} defaultChecked={supplement.form === form} className="peer sr-only" />
                  <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementFormLabels[form]}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <Input id={`edit-dose-${supplement.id}`} name="defaultDose" label="Übliche Einnahmemenge" inputMode="decimal" defaultValue={supplement.defaultDose.toString()} required />
            <fieldset>
              <legend className="text-sm font-semibold text-text-primary">Einheit</legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {supplementDoseUnits.map((unit) => (
                  <label key={unit} className="cursor-pointer">
                    <input type="radio" name="doseUnit" value={unit} defaultChecked={supplement.doseUnit === unit} className="peer sr-only" />
                    <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementDoseUnitLabels[unit]}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
          <fieldset className="mt-5">
            <legend className="text-sm font-semibold text-text-primary">Einnahmegrund</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {supplementReasons.map((reason) => (
                <label key={reason} className="cursor-pointer">
                  <input type="radio" name="reason" value={reason} defaultChecked={supplement.reason === reason} className="peer sr-only" />
                  <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementReasonLabels[reason]}</span>
                </label>
              ))}
            </div>
          </fieldset>
          <label className="mt-5 grid gap-2 text-sm font-semibold text-text-primary">
            Notiz (optional)
            <textarea name="notes" maxLength={500} rows={2} defaultValue={supplement.notes ?? ""} className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 text-base font-normal text-text-primary outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
          </label>
          <Button type="submit" className="mt-5 w-full sm:w-auto">Änderungen speichern</Button>
        </form>

        <details className="mt-5 rounded-[var(--radius-md)] border border-danger bg-surface-raised">
          <summary className="flex min-h-12 cursor-pointer list-none items-center px-4 text-sm font-semibold text-danger marker:hidden">Präparat archivieren</summary>
          <form action={setSupplementArchived} className="border-t border-danger p-4">
            <input type="hidden" name="supplementId" value={supplement.id} />
            <input type="hidden" name="intent" value="archive" />
            <p className="text-sm leading-6 text-text-secondary">Das Präparat verschwindet aus der aktiven Liste. Alle bisherigen Einnahmen bleiben erhalten.</p>
            <label className="mt-3 flex min-h-12 cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border-strong p-3 text-sm font-semibold text-text-primary">
              <input type="checkbox" name="confirmation" value="ARCHIVE" required className="mt-1 size-5 accent-[var(--danger)]" />
              <span>Ja, dieses Präparat archivieren.</span>
            </label>
            <button type="submit" className="mt-3 inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-md)] border border-danger px-5 py-3 text-sm font-semibold text-danger sm:w-auto">Präparat archivieren</button>
          </form>
        </details>
      </div>
    </details>
  );
}
