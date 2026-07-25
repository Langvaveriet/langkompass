import Link from "next/link";

import { correctLabResult } from "@/app/laborwerte/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  labCorrectionReasonLabels,
  labCorrectionReasons,
} from "@/lib/labs/correction-reasons";

type LabResultCorrectionFormProps = {
  result: {
    id: string;
    analyteName: string;
    value: { toString(): string };
    referenceLow: { toString(): string } | null;
    referenceHigh: { toString(): string } | null;
    note: string | null;
  };
  reportId: string;
  analyteKey: string;
};

export function LabResultCorrectionForm({
  result,
  reportId,
  analyteKey,
}: LabResultCorrectionFormProps) {
  return (
    <form action={correctLabResult} className="mt-4 rounded-[var(--radius-md)] border border-copper bg-copper-soft p-4">
      <input type="hidden" name="labResultId" value={result.id} />
      <input type="hidden" name="labReportId" value={reportId} />
      <h4 className="font-semibold text-text-primary">{result.analyteName} korrigieren</h4>
      <p className="mt-1 text-sm leading-6 text-text-secondary">
        Der bisherige Stand bleibt mit Korrekturgrund und Zeitpunkt erhalten.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Input id={`value-${result.id}`} name="value" inputMode="decimal" label="Messwert" defaultValue={result.value.toString()} required />
        <Input id={`referenceLow-${result.id}`} name="referenceLow" inputMode="decimal" label="Referenz von" defaultValue={result.referenceLow?.toString() ?? ""} />
        <Input id={`referenceHigh-${result.id}`} name="referenceHigh" inputMode="decimal" label="Referenz bis" defaultValue={result.referenceHigh?.toString() ?? ""} />
      </div>
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold text-text-primary">Grund der Korrektur</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {labCorrectionReasons.map((reason, index) => (
            <label key={reason} className="cursor-pointer">
              <input className="peer sr-only" type="radio" name="reason" value={reason} defaultChecked={index === 0} />
              <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
                {labCorrectionReasonLabels[reason]}
              </span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="mt-4 grid gap-2 text-sm font-semibold text-text-primary">
        Notiz (optional)
        <textarea name="note" maxLength={500} rows={2} defaultValue={result.note ?? ""} className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 text-base font-normal text-text-primary outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
      </label>
      <div className="mt-5 flex flex-wrap gap-3">
        <Button type="submit">Korrektur speichern</Button>
        <Link href={`/laborwerte?report=${encodeURIComponent(reportId)}&analyte=${encodeURIComponent(analyteKey)}`} className="inline-flex min-h-12 items-center justify-center rounded-[var(--radius-md)] px-5 py-3 text-sm font-semibold text-forest-strong hover:bg-forest-soft">
          Abbrechen
        </Link>
      </div>
    </form>
  );
}
