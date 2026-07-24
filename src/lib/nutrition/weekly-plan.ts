const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;

export function isIsoDate(value: string): boolean {
  if (!isoDatePattern.test(value)) return false;

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

export function addIsoDays(date: string, days: number): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  parsed.setUTCDate(parsed.getUTCDate() + days);
  return parsed.toISOString().slice(0, 10);
}

export function startOfIsoWeek(date: string): string {
  const parsed = new Date(`${date}T00:00:00.000Z`);
  const daysSinceMonday = (parsed.getUTCDay() + 6) % 7;
  return addIsoDays(date, -daysSinceMonday);
}

export function isoWeekDates(date: string): string[] {
  const monday = startOfIsoWeek(date);
  return Array.from({ length: 7 }, (_, index) => addIsoDays(monday, index));
}
