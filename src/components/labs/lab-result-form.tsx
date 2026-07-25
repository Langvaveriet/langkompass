import { addLabResult } from "@/app/laborwerte/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  labAnalytes,
  labCategories,
  labCategoryLabels,
} from "@/lib/labs/lab-catalog";

type LabResultFormProps = {
  reportId: string;
  recordedAnalyteKeys: string[];
};

export function LabResultForm({
  reportId,
  recordedAnalyteKeys,
}: LabResultFormProps) {
  const recorded = new Set(recordedAnalyteKeys);

  return (
    <details className="mt-6 rounded-[var(--radius-xl)] border border-border-strong bg-surface-raised">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-forest-strong marker:hidden">
        <span>Laborwert ergänzen</span>
        <span aria-hidden="true" className="text-2xl">+</span>
      </summary>
      <form action={addLabResult} className="border-t border-border p-5">
        <input type="hidden" name="labReportId" value={reportId} />
        <fieldset>
          <legend className="text-sm font-semibold text-text-primary">Welcher Wert?</legend>
          <div className="mt-4 grid gap-4">
            {labCategories.map((category, categoryIndex) => (
              <details key={category} open={categoryIndex === 0} className="rounded-[var(--radius-md)] border border-border bg-surface">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold text-text-primary marker:hidden">
                  {labCategoryLabels[category]}
                  <span aria-hidden="true">›</span>
                </summary>
                <div className="grid gap-2 border-t border-border p-3 sm:grid-cols-2">
                  {labAnalytes.filter((analyte) => analyte.category === category).map((analyte) => {
                    const alreadyRecorded = recorded.has(analyte.key);
                    const sourceLabel = "sourceLabels" in analyte
                      ? analyte.sourceLabels.join(" · ")
                      : null;
                    return (
                      <label key={analyte.key} className={alreadyRecorded ? "cursor-not-allowed opacity-45" : "cursor-pointer"}>
                        <input type="radio" name="analyteKey" value={analyte.key} disabled={alreadyRecorded} className="peer sr-only" />
                        <span className="flex min-h-14 items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-focus-visible:outline peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus">
                          <span className="min-w-0">
                            <span className="block font-semibold text-text-primary">{analyte.shortName}</span>
                            {sourceLabel ? (
                              <span className="mt-1 block text-xs font-medium text-copper">Schwedisch: {sourceLabel}</span>
                            ) : null}
                          </span>
                          <span className="text-xs text-text-muted">{alreadyRecorded ? "erfasst" : analyte.unit}</span>
                        </span>
                      </label>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <Input id="value" name="value" inputMode="decimal" label="Messwert" placeholder="z. B. 4,8" required />
          <Input id="referenceLow" name="referenceLow" inputMode="decimal" label="Referenz von" placeholder="optional" />
          <Input id="referenceHigh" name="referenceHigh" inputMode="decimal" label="Referenz bis" placeholder="optional" />
        </div>
        <p className="mt-2 text-sm leading-6 text-text-muted">
          Einheit und Parametername werden aus der Auswahl übernommen. Referenzgrenzen bitte genau aus demselben Laborbericht eintragen.
        </p>
        <label className="mt-4 grid gap-2 text-sm font-semibold text-text-primary">
          Notiz (optional)
          <textarea name="note" maxLength={500} rows={2} className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 text-base font-normal text-text-primary outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
        </label>
        <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto">Laborwert speichern</Button>
      </form>
    </details>
  );
}
