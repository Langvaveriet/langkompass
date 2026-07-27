export type DashboardReminder = {
  key: "weight" | "supplements";
  eyebrow: string;
  title: string;
  detail: string;
  href: string;
  action: string;
  marker: string;
};

export function buildDailyReminders({
  date,
  hasWeightMeasurement,
  supplementIntakeCount,
  activeSupplementCount,
}: {
  date: string;
  hasWeightMeasurement: boolean;
  supplementIntakeCount: number;
  activeSupplementCount: number;
}): DashboardReminder[] {
  return [
    ...(!hasWeightMeasurement
      ? [{
          key: "weight" as const,
          eyebrow: "Heute noch offen",
          title: "Gewicht messen",
          detail: "Messung im Morgen-Check dokumentieren",
          href: `/tageserfassung?date=${date}#morgen-check`,
          action: "Gewicht erfassen",
          marker: "kg",
        }]
      : []),
    ...(supplementIntakeCount === 0
      ? [{
          key: "supplements" as const,
          eyebrow: "Heute noch offen",
          title: activeSupplementCount > 0
            ? "Supplemente einnehmen"
            : "Supplemente einrichten",
          detail: activeSupplementCount > 0
            ? "Einnahme für heute dokumentieren"
            : "Präparate anlegen und Einnahme dokumentieren",
          href: activeSupplementCount > 0
            ? "/supplemente#active-supplements-heading"
            : "/supplemente",
          action: activeSupplementCount > 0
            ? "Einnahme erfassen"
            : "Supplemente öffnen",
          marker: "S",
        }]
      : []),
  ];
}
