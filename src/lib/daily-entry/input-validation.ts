export type InputValidation<T> =
  | { success: true; value: T | null }
  | { success: false };

function emptyValue<T>(): InputValidation<T> {
  return { success: true, value: null };
}

function invalidValue<T>(): InputValidation<T> {
  return { success: false };
}

export function parseOptionalInteger(
  value: string | null,
  minimum: number,
  maximum: number,
): InputValidation<number> {
  if (value === null) return emptyValue();
  if (!/^\d+$/.test(value)) return invalidValue();

  const parsedValue = Number(value);
  return parsedValue >= minimum && parsedValue <= maximum
    ? { success: true, value: parsedValue }
    : invalidValue();
}

export function parseOptionalDecimal(
  value: string | null,
  minimum: number,
  maximum: number,
): InputValidation<string> {
  if (value === null) return emptyValue();

  const normalizedValue = value.replace(",", ".");
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalizedValue)) {
    return invalidValue();
  }

  const parsedValue = Number(normalizedValue);
  return parsedValue >= minimum && parsedValue <= maximum
    ? { success: true, value: normalizedValue }
    : invalidValue();
}

export function parseOptionalScale(
  value: string | null,
  minimum = 1,
): InputValidation<number> {
  return parseOptionalInteger(value, minimum, 10);
}

export function parseIsoDate(value: string | null): InputValidation<Date> {
  if (value === null || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return invalidValue();
  }

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsedDate.getTime()) &&
    parsedDate.toISOString().slice(0, 10) === value
    ? { success: true, value: parsedDate }
    : invalidValue();
}

export function isTime(value: string | null): value is string {
  return value !== null && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value);
}
