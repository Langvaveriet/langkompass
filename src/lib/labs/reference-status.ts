export type LabReferenceStatus =
  | "BELOW"
  | "WITHIN"
  | "ABOVE"
  | "UNAVAILABLE";

export function labReferenceStatus(
  value: number,
  referenceLow: number | null,
  referenceHigh: number | null,
): LabReferenceStatus {
  if (referenceLow !== null && value < referenceLow) return "BELOW";
  if (referenceHigh !== null && value > referenceHigh) return "ABOVE";
  if (referenceLow !== null || referenceHigh !== null) return "WITHIN";
  return "UNAVAILABLE";
}
