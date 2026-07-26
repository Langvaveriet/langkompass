export const compassReportPeriods = [7, 30, 365] as const;

export type CompassReportPeriod = (typeof compassReportPeriods)[number];

export const compassReportPeriodLabels: Record<CompassReportPeriod, string> = {
  7: "7 Tage",
  30: "30 Tage",
  365: "Jahresbericht",
};

export function parseCompassReportPeriod(value: string | undefined): CompassReportPeriod {
  const parsed = Number(value);
  return compassReportPeriods.includes(parsed as CompassReportPeriod)
    ? parsed as CompassReportPeriod
    : 30;
}
