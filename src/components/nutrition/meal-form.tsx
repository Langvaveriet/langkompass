import { saveMeal } from "@/app/ernaehrung/actions";
import type { MealType, PortionSize } from "@/generated/prisma/enums";
import { foodCatalog } from "@/lib/nutrition/food-catalog";

type MealFormValues = {
  id?: string;
  type: MealType;
  time: string;
  portion: PortionSize;
  foodKeys: string[];
  customFood: string;
  notes: string;
};

type MealFormProps = { entryDate: string; values: MealFormValues };

const mealTypes = [
  { value: "BREAKFAST", label: "Frühstück", emoji: "🌅" },
  { value: "LUNCH", label: "Mittag", emoji: "☀️" },
  { value: "DINNER", label: "Abend", emoji: "🌙" },
  { value: "SNACK", label: "Snack", emoji: "🍎" },
  { value: "DRINK", label: "Getränk", emoji: "🥤" },
] as const;

const portions = [
  { value: "SMALL", label: "Klein" },
  { value: "MEDIUM", label: "Normal" },
  { value: "LARGE", label: "Groß" },
] as const;

export function MealForm({ entryDate, values }: MealFormProps) {
  return (
    <form action={saveMeal} className="grid gap-7">
      <input type="hidden" name="entryDate" value={entryDate} />
      {values.id ? <input type="hidden" name="mealId" value={values.id} /> : null}

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-text-primary">Mahlzeit</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {mealTypes.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input className="peer sr-only" type="radio" name="type" value={option.value} defaultChecked={values.type === option.value} />
              <span className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-2 py-2 text-sm font-semibold text-text-primary transition peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong peer-focus-visible:ring-2 peer-focus-visible:ring-forest-strong">
                <span aria-hidden="true">{option.emoji}</span>{option.label}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label htmlFor="consumedTime" className="text-sm font-semibold text-text-primary">Uhrzeit</label>
        <input id="consumedTime" name="consumedTime" type="time" required defaultValue={values.time} className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base text-text-primary focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-text-primary">Was war dabei?</legend>
        <div className="flex flex-wrap gap-2">
          {foodCatalog.map((food) => (
            <label key={food.key} className="cursor-pointer">
              <input className="peer sr-only" type="checkbox" name="foodKeys" value={food.key} defaultChecked={values.foodKeys.includes(food.key)} />
              <span className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong bg-surface-primary px-4 py-2 text-sm font-medium text-text-primary transition peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong peer-focus-visible:ring-2 peer-focus-visible:ring-forest-strong">
                <span aria-hidden="true">{food.emoji}</span>{food.name}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-2">
        <label htmlFor="customFood" className="text-sm font-semibold text-text-primary">Etwas anderes <span className="font-normal text-text-muted">(optional)</span></label>
        <input id="customFood" name="customFood" defaultValue={values.customFood} placeholder="Lebensmittel ergänzen" className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 text-base text-text-primary placeholder:text-text-muted focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
      </div>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold text-text-primary">Ungefähre Portion</legend>
        <div className="grid grid-cols-3 gap-2">
          {portions.map((option) => (
            <label key={option.value} className="cursor-pointer">
              <input className="peer sr-only" type="radio" name="portion" value={option.value} defaultChecked={values.portion === option.value} />
              <span className="flex min-h-12 items-center justify-center rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-3 text-sm font-semibold transition peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong peer-focus-visible:ring-2 peer-focus-visible:ring-forest-strong">{option.label}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <details className="rounded-[var(--radius-md)] border border-border-subtle">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-text-primary">Optionale Notiz</summary>
        <div className="border-t border-border-subtle p-4">
          <textarea name="notes" rows={3} defaultValue={values.notes} placeholder="Nur wenn etwas Besonderes wichtig ist." className="w-full rounded-[var(--radius-md)] border border-border-strong bg-surface-primary px-4 py-3 text-base text-text-primary placeholder:text-text-muted focus:border-forest-strong focus:ring-2 focus:ring-forest-soft" />
        </div>
      </details>

      <button type="submit" className="min-h-14 rounded-[var(--radius-md)] bg-forest-strong px-6 py-4 text-base font-semibold text-surface transition hover:opacity-90">
        {values.id ? "Änderungen speichern" : "Mahlzeit speichern"}
      </button>
    </form>
  );
}
