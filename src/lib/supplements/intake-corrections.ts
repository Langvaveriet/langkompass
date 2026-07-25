export const supplementIntakeCorrectionReasons = [
  "ENTRY_ERROR",
  "TIME_CORRECTION",
  "DOSE_CORRECTION",
  "OBSERVATION_UPDATE",
  "OTHER",
] as const;

export type SupplementIntakeCorrectionReason =
  (typeof supplementIntakeCorrectionReasons)[number];

export const supplementIntakeCorrectionReasonLabels: Record<
  SupplementIntakeCorrectionReason,
  string
> = {
  ENTRY_ERROR: "Eingabefehler",
  TIME_CORRECTION: "Zeitpunkt korrigiert",
  DOSE_CORRECTION: "Menge korrigiert",
  OBSERVATION_UPDATE: "Beobachtung ergänzt",
  OTHER: "Sonstige Korrektur",
};
