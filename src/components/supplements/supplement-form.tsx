import { createSupplement } from "@/app/supplemente/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  supplementDoseUnitLabels,
  supplementDoseUnits,
  supplementFormLabels,
  supplementForms,
  supplementIngredientUnitLabels,
  supplementIngredientUnits,
  supplementReasonLabels,
  supplementReasons,
} from "@/lib/supplements/supplement-options";

export function SupplementForm({ initiallyOpen }: { initiallyOpen: boolean }) {
  return (
    <details open={initiallyOpen} className="rounded-[var(--radius-lg)] border border-border-strong bg-surface-raised">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-base font-semibold text-forest-strong marker:hidden">
        <span>Supplement hinzufügen</span>
        <span aria-hidden="true" className="text-2xl">+</span>
      </summary>
      <form action={createSupplement} className="border-t border-border p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input id="supplement-name" name="name" label="Produktname" placeholder="z. B. Magnesium Komplex" minLength={2} maxLength={100} required />
          <Input id="supplement-brand" name="brand" label="Hersteller (optional)" maxLength={100} />
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-text-primary">Darreichungsform</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {supplementForms.map((form, index) => (
              <label key={form} className="cursor-pointer">
                <input type="radio" name="form" value={form} defaultChecked={index === 0} className="peer sr-only" />
                <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementFormLabels[form]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <Input id="default-dose" name="defaultDose" label="Übliche Einnahmemenge" inputMode="decimal" defaultValue="1" required />
          <fieldset>
            <legend className="text-sm font-semibold text-text-primary">Einheit der Einnahme</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {supplementDoseUnits.map((unit, index) => (
                <label key={unit} className="cursor-pointer">
                  <input type="radio" name="doseUnit" value={unit} defaultChecked={index === 0} className="peer sr-only" />
                  <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementDoseUnitLabels[unit]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <fieldset className="mt-5">
          <legend className="text-sm font-semibold text-text-primary">Warum nimmst du es?</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {supplementReasons.map((reason, index) => (
              <label key={reason} className="cursor-pointer">
                <input type="radio" name="reason" value={reason} defaultChecked={index === 0} className="peer sr-only" />
                <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementReasonLabels[reason]}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="mt-5 rounded-[var(--radius-md)] border border-border bg-surface p-4">
          <h3 className="font-semibold text-text-primary">Hauptwirkstoff</h3>
          <p className="mt-1 text-sm leading-6 text-text-muted">Die elementare Menge ist besonders bei Mineralstoffverbindungen hilfreich und bleibt optional.</p>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Input id="ingredient-name" name="ingredientName" label="Wirkstoff" placeholder="z. B. Magnesiumcitrat" minLength={2} maxLength={100} required />
            <Input id="ingredient-amount" name="ingredientAmount" label="Verbindungsmenge" inputMode="decimal" placeholder="optional" />
            <Input id="elemental-amount" name="elementalAmount" label="Davon elementar" inputMode="decimal" placeholder="optional" />
          </div>
          <fieldset className="mt-4">
            <legend className="text-sm font-semibold text-text-primary">Wirkstoffeinheit</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {supplementIngredientUnits.map((unit, index) => (
                <label key={unit} className="cursor-pointer">
                  <input type="radio" name="ingredientUnit" value={unit} defaultChecked={index === 0} className="peer sr-only" />
                  <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementIngredientUnitLabels[unit]}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </div>

        <details className="mt-5 rounded-[var(--radius-md)] border border-border bg-surface">
          <summary className="flex min-h-12 cursor-pointer list-none items-center px-4 text-sm font-semibold text-forest-strong marker:hidden">Optionale Notiz</summary>
          <label className="grid gap-2 border-t border-border p-4 text-sm font-semibold text-text-primary">
            Persönlicher Hinweis
            <textarea name="notes" maxLength={500} rows={3} className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 text-base font-normal text-text-primary outline-none focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
          </label>
        </details>

        <Button type="submit" size="lg" className="mt-5 w-full sm:w-auto">Supplement speichern</Button>
      </form>
    </details>
  );
}
