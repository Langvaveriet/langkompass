import { saveHealthProfile } from "@/app/gesundheitsprofil/actions";
import { ChipSelector } from "@/components/health-input/chip-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type HealthProfileFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  height: string;
  weight: string;
  calorieFormulaSex: string;
  activityLevel: string;
  weightGoal: string;
  manualDailyCalorieTarget: string;
  primaryGoal: string;
  activityGoal: string;
  preferredDietaryPatterns: string[];
  excludedFoodCategories: string[];
  avoidHistamine: boolean;
  maxRecipePrepMinutes: string;
};

type HealthProfileFormProps = {
  values: HealthProfileFormValues;
};

export function HealthProfileForm({
  values,
}: HealthProfileFormProps) {
  return (
    <form className="grid gap-8" action={saveHealthProfile}>
      <fieldset className="grid gap-5">
        <legend className="text-base font-semibold text-text-primary">
          Persönliche Angaben
        </legend>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            id="firstName"
            name="firstName"
            label="Vorname"
            autoComplete="given-name"
            defaultValue={values.firstName}
            placeholder="Vorname"
          />

          <Input
            id="lastName"
            name="lastName"
            label="Nachname"
            autoComplete="family-name"
            defaultValue={values.lastName}
            placeholder="Nachname"
          />

          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            label="Geburtsdatum"
            type="date"
            autoComplete="bday"
            defaultValue={values.dateOfBirth}
          />

          <Input
            id="height"
            name="height"
            label="Körpergröße"
            type="number"
            min="50"
            max="250"
            step="1"
            inputMode="numeric"
            defaultValue={values.height}
            placeholder="180"
            hint="Angabe in Zentimetern"
          />

          <Input
            id="weight"
            name="weight"
            label="Körpergewicht"
            type="number"
            min="20"
            max="500"
            step="0.1"
            inputMode="decimal"
            defaultValue={values.weight}
            placeholder="80,0"
            hint="Angabe in Kilogramm"
          />
        </div>
      </fieldset>

      <fieldset className="grid gap-5 rounded-[var(--radius-lg)] bg-surface-muted p-4 sm:p-5">
        <div>
          <legend className="text-base font-semibold text-text-primary">
            Persönliches Kalorienziel
          </legend>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Diese Angaben ermöglichen eine Näherung deines täglichen
            Energiebedarfs. Sie ersetzen keine medizinische Ernährungsberatung.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <div className="grid gap-2">
            <label htmlFor="calorieFormulaSex" className="text-sm font-semibold text-text-primary">
              Berechnungsgrundlage
            </label>
            <select id="calorieFormulaSex" name="calorieFormulaSex" defaultValue={values.calorieFormulaSex} className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 text-base text-text-primary">
              <option value="">Bitte auswählen</option>
              <option value="FEMALE">Weibliche Formel</option>
              <option value="MALE">Männliche Formel</option>
            </select>
            <p className="text-xs leading-5 text-text-muted">Wird ausschließlich für die Stoffwechsel-Formel verwendet.</p>
          </div>

          <div className="grid gap-2">
            <label htmlFor="activityLevel" className="text-sm font-semibold text-text-primary">Alltagsaktivität</label>
            <select id="activityLevel" name="activityLevel" defaultValue={values.activityLevel} className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 text-base text-text-primary">
              <option value="">Bitte auswählen</option>
              <option value="SEDENTARY">Überwiegend sitzend</option>
              <option value="LIGHT">Leicht aktiv (1–3 Tage/Woche)</option>
              <option value="MODERATE">Moderat aktiv (3–5 Tage/Woche)</option>
              <option value="HIGH">Sehr aktiv (6–7 Tage/Woche)</option>
              <option value="VERY_HIGH">Extrem aktiv / körperliche Arbeit</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label htmlFor="weightGoal" className="text-sm font-semibold text-text-primary">Gewichtsziel</label>
            <select id="weightGoal" name="weightGoal" defaultValue={values.weightGoal} className="min-h-12 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 text-base text-text-primary">
              <option value="">Bitte auswählen</option>
              <option value="LOSE">Langsam abnehmen</option>
              <option value="MAINTAIN">Gewicht halten</option>
              <option value="GAIN">Langsam zunehmen</option>
            </select>
          </div>

          <Input
            id="manualDailyCalorieTarget"
            name="manualDailyCalorieTarget"
            label="Eigenes Tagesziel (optional)"
            type="number"
            min="1000"
            max="6000"
            step="50"
            inputMode="numeric"
            defaultValue={values.manualDailyCalorieTarget}
            placeholder="z. B. 2200"
            hint="Überschreibt die Berechnung, etwa nach professioneller Beratung."
          />
        </div>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="text-base font-semibold text-text-primary">
          Gesundheitsziele
        </legend>

        <div className="grid gap-5 md:grid-cols-2">
          <Input
            id="primaryGoal"
            name="primaryGoal"
            label="Wichtigstes Gesundheitsziel"
            defaultValue={values.primaryGoal}
            placeholder="Zum Beispiel: mehr Energie"
          />

          <Input
            id="activityGoal"
            name="activityGoal"
            label="Bewegungsziel"
            defaultValue={values.activityGoal}
            placeholder="Zum Beispiel: dreimal pro Woche"
          />
        </div>
      </fieldset>

      <fieldset className="grid gap-6 rounded-[var(--radius-lg)] bg-surface-muted p-4 sm:p-5">
        <div>
          <legend className="text-base font-semibold text-text-primary">
            Ernährung und Verträglichkeit
          </legend>
          <p className="mt-2 text-sm leading-6 text-text-muted">
            Diese Angaben filtern Rezeptvorschläge. Sie ersetzen keine
            medizinische Diagnose und keine individuelle Allergenprüfung.
          </p>
        </div>

        <ChipSelector
          name="preferredDietaryPatterns"
          label="Bevorzugte Ernährungsrichtung"
          defaultValues={values.preferredDietaryPatterns}
          emptyOption={{ label: "Keine Einschränkung" }}
          options={[
            { value: "MEDITERRANEAN", label: "Mediterran", emoji: "🫒" },
            { value: "KETOGENIC", label: "Ketogen", emoji: "🥑" },
            { value: "VEGETARIAN", label: "Vegetarisch", emoji: "🥬" },
          ]}
        />

        <ChipSelector
          name="excludedFoodCategories"
          label="Nicht vorschlagen"
          defaultValues={values.excludedFoodCategories}
          emptyOption={{ label: "Keine Ausschlüsse" }}
          options={[
            { value: "FISH_SEAFOOD", label: "Fisch & Meeresfrüchte", emoji: "🐟" },
            { value: "MEAT", label: "Fleisch", emoji: "🥩" },
            { value: "DAIRY", label: "Milchprodukte", emoji: "🥛" },
            { value: "EGG", label: "Ei", emoji: "🥚" },
            { value: "NUT_SEED", label: "Nüsse & Saaten", emoji: "🥜" },
          ]}
        />

        <ChipSelector
          name="nutritionFlags"
          label="Weitere Rücksichtnahme"
          defaultValues={values.avoidHistamine ? ["AVOID_HISTAMINE"] : []}
          emptyOption={{ label: "Keine weitere Einschränkung" }}
          options={[
            { value: "AVOID_HISTAMINE", label: "Histaminbewusst", emoji: "🌿" },
          ]}
        />

        <fieldset className="grid gap-3">
          <legend className="text-sm font-semibold text-text-primary">
            Maximale Zubereitungszeit
          </legend>
          <div className="flex flex-wrap gap-2">
            {[
              { value: "", label: "Egal" },
              { value: "15", label: "Bis 15 Min." },
              { value: "30", label: "Bis 30 Min." },
              { value: "45", label: "Bis 45 Min." },
              { value: "60", label: "Bis 60 Min." },
            ].map((option) => (
              <label key={option.value || "unlimited"} className="cursor-pointer">
                <input
                  type="radio"
                  name="maxRecipePrepMinutes"
                  value={option.value}
                  defaultChecked={values.maxRecipePrepMinutes === option.value}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-11 items-center rounded-full border border-border-strong bg-surface-primary px-4 py-2 text-sm font-semibold text-text-primary peer-checked:border-forest-strong peer-checked:bg-forest-soft peer-checked:text-forest-strong peer-focus-visible:ring-2 peer-focus-visible:ring-forest-strong">
                  {option.label}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4 border-t border-border-subtle pt-6">
        <Button type="submit">
          Profil speichern
        </Button>

        <p className="text-sm text-text-muted">
          Die Angaben werden dauerhaft in PostgreSQL gespeichert.
        </p>
      </div>
    </form>
  );
}
