import { saveUserSettings } from "@/app/einstellungen/actions";
import { Button } from "@/components/ui/button";
import { supportedTimeZones } from "@/lib/user-settings";

type UserSettingsFormProps = {
  timeZone: string;
};

export function UserSettingsForm({ timeZone }: UserSettingsFormProps) {
  return (
    <form action={saveUserSettings} className="grid gap-6">
      <fieldset className="grid gap-4">
        <legend className="text-base font-semibold text-text-primary">
          Persönliche Zeitzone
        </legend>
        <p className="text-sm leading-6 text-text-muted">
          Sie bestimmt, welchem Tag Mahlzeiten und Tageserfassungen zugeordnet
          und mit welcher Uhrzeit sie angezeigt werden.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {supportedTimeZones.map((option) => (
            <label
              key={option.value}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-[var(--radius-md)] border border-border-strong bg-surface-raised px-4 py-3 text-sm font-semibold text-text-primary has-[:checked]:border-forest-strong has-[:checked]:bg-forest-soft"
            >
              <input
                type="radio"
                name="timeZone"
                value={option.value}
                defaultChecked={timeZone === option.value}
                className="h-4 w-4 accent-forest-strong"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="rounded-[var(--radius-md)] bg-surface-muted p-4">
        <p className="text-sm font-semibold text-text-primary">
          Sprache und Einheiten
        </p>
        <p className="mt-1 text-sm leading-6 text-text-muted">
          Deutsch sowie metrische Einheiten sind in dieser Entwicklungsphase
          verbindlich eingestellt.
        </p>
      </div>

      <div className="border-t border-border-subtle pt-6">
        <Button type="submit">Einstellungen speichern</Button>
      </div>
    </form>
  );
}
