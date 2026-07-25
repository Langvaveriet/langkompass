import { logSupplementIntake } from "@/app/supplemente/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  supplementEffectLabels,
  supplementEffects,
  supplementToleranceLabels,
  supplementTolerances,
} from "@/lib/supplements/supplement-options";

type SupplementIntakeFormProps = {
  supplementId: string;
  defaultDose: string;
  defaultDate: string;
  defaultTime: string;
};

export function SupplementIntakeForm({ supplementId, defaultDose, defaultDate, defaultTime }: SupplementIntakeFormProps) {
  return (
    <form action={logSupplementIntake} className="grid gap-5 border-t border-border p-4">
      <input type="hidden" name="supplementId" value={supplementId} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Input id={`taken-date-${supplementId}`} name="takenDate" type="date" label="Datum" defaultValue={defaultDate} required />
        <Input id={`taken-time-${supplementId}`} name="takenTime" type="time" label="Uhrzeit" defaultValue={defaultTime} required />
        <Input id={`dose-${supplementId}`} name="dose" inputMode="decimal" label="Einnahmemenge" defaultValue={defaultDose} required />
      </div>
      <fieldset>
        <legend className="text-sm font-semibold text-text-primary">Verträglichkeit</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {supplementTolerances.map((tolerance) => (
            <label key={tolerance} className="cursor-pointer">
              <input type="radio" name="tolerance" value={tolerance} defaultChecked={tolerance === "NOT_RATED"} className="peer sr-only" />
              <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementToleranceLabels[tolerance]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="text-sm font-semibold text-text-primary">Beobachtete Wirkung</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {supplementEffects.map((effect) => (
            <label key={effect} className="cursor-pointer">
              <input type="radio" name="effect" value={effect} defaultChecked={effect === "NOT_RATED"} className="peer sr-only" />
              <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementEffectLabels[effect]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="grid gap-2 text-sm font-semibold text-text-primary">
        Beobachtung (optional)
        <textarea name="note" maxLength={500} rows={2} className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 text-base font-normal text-text-primary outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
      </label>
      <Button type="submit" className="w-full sm:w-auto">Einnahme speichern</Button>
    </form>
  );
}
