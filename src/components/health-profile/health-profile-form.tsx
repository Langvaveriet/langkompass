import { saveHealthProfile } from "@/app/gesundheitsprofil/actions";
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
