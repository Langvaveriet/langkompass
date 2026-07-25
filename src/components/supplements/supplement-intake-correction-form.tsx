import { correctSupplementIntake } from "@/app/supplemente/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  SupplementDoseUnit,
  SupplementEffect,
  SupplementTolerance,
} from "@/generated/prisma/enums";
import {
  supplementIntakeCorrectionReasonLabels,
  supplementIntakeCorrectionReasons,
} from "@/lib/supplements/intake-corrections";
import {
  supplementDoseUnitLabels,
  supplementDoseUnits,
  supplementEffectLabels,
  supplementEffects,
  supplementToleranceLabels,
  supplementTolerances,
} from "@/lib/supplements/supplement-options";

type SupplementIntakeCorrectionFormProps = {
  intake: {
    id: string;
    dose: { toString(): string };
    doseUnit: SupplementDoseUnit;
    tolerance: SupplementTolerance;
    effect: SupplementEffect;
    note: string | null;
  };
  takenDate: string;
  takenTime: string;
  returnPeriod: string;
  returnSupplementId: string | null;
};

export function SupplementIntakeCorrectionForm({
  intake,
  takenDate,
  takenTime,
  returnPeriod,
  returnSupplementId,
}: SupplementIntakeCorrectionFormProps) {
  return (
    <form action={correctSupplementIntake} className="mt-4 rounded-[var(--radius-md)] border border-copper bg-copper-soft p-4">
      <input type="hidden" name="intakeId" value={intake.id} />
      <input type="hidden" name="returnPeriod" value={returnPeriod} />
      {returnSupplementId ? <input type="hidden" name="returnSupplementId" value={returnSupplementId} /> : null}
      <p className="font-semibold text-text-primary">Einnahme korrigieren</p>
      <p className="mt-1 text-sm leading-6 text-text-secondary">Der vorherige Stand bleibt mit Grund und Zeitpunkt gespeichert.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Input id={`correction-date-${intake.id}`} name="takenDate" type="date" label="Datum" defaultValue={takenDate} required />
        <Input id={`correction-time-${intake.id}`} name="takenTime" type="time" label="Uhrzeit" defaultValue={takenTime} required />
        <Input id={`correction-dose-${intake.id}`} name="dose" inputMode="decimal" label="Einnahmemenge" defaultValue={intake.dose.toString()} required />
      </div>
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold text-text-primary">Einheit</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {supplementDoseUnits.map((unit) => (
            <label key={unit} className="cursor-pointer">
              <input type="radio" name="doseUnit" value={unit} defaultChecked={intake.doseUnit === unit} className="peer sr-only" />
              <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementDoseUnitLabels[unit]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold text-text-primary">Verträglichkeit</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {supplementTolerances.map((tolerance) => (
            <label key={tolerance} className="cursor-pointer">
              <input type="radio" name="tolerance" value={tolerance} defaultChecked={intake.tolerance === tolerance} className="peer sr-only" />
              <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementToleranceLabels[tolerance]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold text-text-primary">Beobachtete Wirkung</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {supplementEffects.map((effect) => (
            <label key={effect} className="cursor-pointer">
              <input type="radio" name="effect" value={effect} defaultChecked={intake.effect === effect} className="peer sr-only" />
              <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementEffectLabels[effect]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-4 grid gap-2 text-sm font-semibold text-text-primary">
        Beobachtung (optional)
        <textarea name="note" maxLength={500} rows={2} defaultValue={intake.note ?? ""} className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 text-base font-normal text-text-primary outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
      </label>
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold text-text-primary">Grund der Korrektur</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {supplementIntakeCorrectionReasons.map((reason, index) => (
            <label key={reason} className="cursor-pointer">
              <input type="radio" name="reason" value={reason} defaultChecked={index === 0} className="peer sr-only" />
              <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementIntakeCorrectionReasonLabels[reason]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit" className="mt-5 w-full sm:w-auto">Korrektur speichern</Button>
    </form>
  );
}
