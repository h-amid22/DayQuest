const CALENDAR_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isCalendarDate(value: string): boolean {
  const match = CALENDAR_DATE.exec(value);
  if (!match) return false;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  return date.getUTCFullYear() === Number(match[1]) && date.getUTCMonth() === Number(match[2]) - 1 && date.getUTCDate() === Number(match[3]);
}

export function planningDate(value: string): Date {
  if (!isCalendarDate(value)) throw new Error("Invalid planning date");
  return new Date(`${value}T00:00:00.000Z`);
}

export function calendarDate(value: Date): string { return value.toISOString().slice(0, 10); }

export function assertTimeRange(startTime: number | null | undefined, endTime: number | null | undefined): void {
  if (startTime != null && endTime != null && endTime <= startTime) throw new Error("End time must be greater than start time");
}
