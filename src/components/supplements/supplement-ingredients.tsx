import {
  deleteSupplementIngredient,
  saveSupplementIngredient,
} from "@/app/supplemente/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SupplementIngredientUnit } from "@/generated/prisma/enums";
import {
  supplementIngredientUnitLabels,
  supplementIngredientUnits,
} from "@/lib/supplements/supplement-options";

export type SupplementIngredientValues = {
  id: string;
  name: string;
  amount: { toString(): string } | null;
  elementalAmount: { toString(): string } | null;
  unit: SupplementIngredientUnit | null;
};

type IngredientFieldsProps = {
  supplementId: string;
  ingredient?: SupplementIngredientValues;
};

function IngredientFields({ supplementId, ingredient }: IngredientFieldsProps) {
  return (
    <>
      <input type="hidden" name="supplementId" value={supplementId} />
      {ingredient ? <input type="hidden" name="ingredientId" value={ingredient.id} /> : null}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Input id={`ingredient-name-${ingredient?.id ?? supplementId}`} name="ingredientName" label="Wirkstoff" defaultValue={ingredient?.name ?? ""} minLength={2} maxLength={100} required />
        </div>
        <Input id={`ingredient-amount-${ingredient?.id ?? supplementId}`} name="ingredientAmount" label="Verbindungsmenge" inputMode="decimal" defaultValue={ingredient?.amount?.toString() ?? ""} placeholder="optional" />
        <Input id={`elemental-amount-${ingredient?.id ?? supplementId}`} name="elementalAmount" label="Davon elementar" inputMode="decimal" defaultValue={ingredient?.elementalAmount?.toString() ?? ""} placeholder="optional" />
      </div>
      <fieldset className="mt-4">
        <legend className="text-sm font-semibold text-text-primary">Einheit</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {supplementIngredientUnits.map((unit, index) => (
            <label key={unit} className="cursor-pointer">
              <input type="radio" name="ingredientUnit" value={unit} defaultChecked={ingredient ? ingredient.unit === unit : index === 0} className="peer sr-only" />
              <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-raised px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong">{supplementIngredientUnitLabels[unit]}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

export function SupplementIngredients({
  supplementId,
  ingredients,
  initiallyOpen = false,
}: {
  supplementId: string;
  ingredients: SupplementIngredientValues[];
  initiallyOpen?: boolean;
}) {
  return (
    <details
      open={initiallyOpen}
      className="mt-4 rounded-[var(--radius-md)] border border-border bg-surface"
    >
      <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold text-forest-strong marker:hidden">
        <span>Wirkstoffe verwalten · {ingredients.length}</span>
        <span aria-hidden="true">›</span>
      </summary>
      <div className="grid gap-3 border-t border-border p-4">
        {ingredients.map((ingredient) => (
          <details key={ingredient.id} className="rounded-[var(--radius-md)] border border-border bg-surface-raised">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold text-text-primary marker:hidden">
              <span>{ingredient.name}</span>
              <span className="text-forest-strong">Bearbeiten</span>
            </summary>
            <div className="border-t border-border p-4">
              <form action={saveSupplementIngredient}>
                <IngredientFields supplementId={supplementId} ingredient={ingredient} />
                <Button type="submit" className="mt-4 w-full sm:w-auto">Wirkstoff speichern</Button>
              </form>
              <form action={deleteSupplementIngredient} className="mt-4 border-t border-border pt-4">
                <input type="hidden" name="supplementId" value={supplementId} />
                <input type="hidden" name="ingredientId" value={ingredient.id} />
                <label className="flex min-h-11 cursor-pointer items-center gap-3 text-sm font-semibold text-text-primary">
                  <input type="checkbox" name="confirmDeletion" value="DELETE" required className="size-5 accent-[var(--danger)]" />
                  <span>Löschen bestätigen</span>
                </label>
                <button type="submit" className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-danger">Wirkstoff löschen</button>
              </form>
            </div>
          </details>
        ))}

        <details className="rounded-[var(--radius-md)] border border-forest-soft bg-forest-soft">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-semibold text-forest-strong marker:hidden">
            <span>Weiteren Wirkstoff hinzufügen</span>
            <span aria-hidden="true" className="text-xl">+</span>
          </summary>
          <form action={saveSupplementIngredient} className="border-t border-forest-soft bg-surface-raised p-4">
            <IngredientFields supplementId={supplementId} />
            <Button type="submit" className="mt-4 w-full sm:w-auto">Wirkstoff hinzufügen</Button>
          </form>
        </details>
      </div>
    </details>
  );
}
