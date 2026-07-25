export type LabReferenceDefault = {
  referenceLow: string;
  referenceHigh: string;
};

type DecimalLike = string | number | { toString(): string } | null;

type ReferenceRangeSource = {
  analyteKey: string;
  referenceLow: DecimalLike;
  referenceHigh: DecimalLike;
};

function inputValue(value: DecimalLike): string {
  return value === null ? "" : value.toString();
}

export function buildLabReferenceDefaults(
  savedRanges: ReferenceRangeSource[],
  previousResults: ReferenceRangeSource[],
): Record<string, LabReferenceDefault> {
  const defaults: Record<string, LabReferenceDefault> = {};

  for (const range of savedRanges) {
    defaults[range.analyteKey] = {
      referenceLow: inputValue(range.referenceLow),
      referenceHigh: inputValue(range.referenceHigh),
    };
  }

  for (const result of previousResults) {
    if (result.analyteKey in defaults) continue;
    defaults[result.analyteKey] = {
      referenceLow: inputValue(result.referenceLow),
      referenceHigh: inputValue(result.referenceHigh),
    };
  }

  return defaults;
}
