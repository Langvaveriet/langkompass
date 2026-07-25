export const labCorrectionReasons = [
  "ENTRY_ERROR",
  "REPORT_CORRECTION",
  "REFERENCE_UPDATE",
  "OTHER",
] as const;

export type LabCorrectionReason = (typeof labCorrectionReasons)[number];

export const labCorrectionReasonLabels: Record<LabCorrectionReason, string> = {
  ENTRY_ERROR: "Eingabefehler",
  REPORT_CORRECTION: "Laborbericht korrigiert",
  REFERENCE_UPDATE: "Referenzbereich angepasst",
  OTHER: "Sonstige Korrektur",
};
