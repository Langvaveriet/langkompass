import { saveHealthProfile } from "@/app/gesundheitsprofil/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export type HealthProfileFormValues = {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  height: string;
  weight: string;
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
