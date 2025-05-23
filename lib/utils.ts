import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import {
  startOfISOWeek,
  addDays,
  setISOWeek,
  setYear,
  format,
  getDay,
  parseISO,
  eachDayOfInterval,
  isToday,
  isTomorrow,
  isYesterday,
  differenceInCalendarDays,
} from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates the dates of the week (Monday to Sunday) for a given ISO week number and year.
 *
 * @param {number} weekNumber - The ISO week number (1–53).
 * @param {number} year - The year (e.g., 2025).
 * @returns {Array<{ day: string, date: string }>} - An array of objects with day name and date (YYYY-MM-DD).
 */
export function getWeekDates(
  weekNumber: number,
  year: number,
): { day: string; date: string }[] {
  // Start from the first ISO week of the year
  const date = startOfISOWeek(
    setISOWeek(setYear(new Date(), year), weekNumber),
  );

  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = addDays(date, i);
    days.push({
      day: format(currentDay, 'EEE'), // Full name of the day (e.g., "Mon")
      date: format(currentDay, 'dd'), // ISO format date
    });
  }
  return days;
}

/**
 * Conditionally returns a Prisma `connect` object for a relational field
 * if the provided ID is defined, non-null, and non-empty.
 *
 * Useful for safely constructing `connect` clauses in Prisma `create` or `update` operations
 * when related IDs may be optional.
 *
 * @template T - The type of the ID (typically string or number).
 * @param {string} key - The name of the relational field in the Prisma schema.
 * @param {T | null | undefined | ""} id - The ID to connect, which may be null, undefined, or an empty string.
 * @returns {object | undefined} - An object with the structure `{ [key]: { connect: { id } } }` if the ID is valid; otherwise `undefined`.
 */
export function connectIfDefined<T>(
  key: string,
  id: T | null | undefined | '',
) {
  if (id === null || id === undefined || id === '') {
    return undefined;
  }

  return { [key]: { connect: { id } } };
}

/**
 * Conditionally returns a Prisma `connect` clause for a list of related records
 * if the provided array of IDs is defined and non-empty.
 *
 * Useful for safely constructing many-to-many `connect` clauses in Prisma `create` or `update` operations
 * when related IDs may be optional.
 *
 * @template T - The type of the IDs (typically string or number).
 * @param {string} key - The name of the relation field in the Prisma schema (e.g., "instruments").
 * @param {T[] | null | undefined} ids - An array of IDs to connect. Maybe null, undefined, or an empty array.
 * @returns {object | undefined} - An object with the structure `{ [key]: { connect: [{ id }, ...] } }` if the array is valid; otherwise `undefined`.
 *
 */
export function connectManyIfDefined<T>(
  key: string,
  ids: T[] | null | undefined,
) {
  if (!Array.isArray(ids) || ids.length === 0) return undefined;
  return { [key]: { connect: ids.map(id => ({ id })) } };
}

export function getFullName<
  T extends { first_name?: string | null; last_name?: string | null },
>(user?: T | null): string {
  const first = user?.first_name?.trim();
  const last = user?.last_name?.trim();

  if (!first && !last) return '-';
  if (first && !last) return first;
  if (!first && last) return last;
  return `${first} ${last}`;
}

export function getInitials<
  T extends { first_name?: string | null; last_name?: string | null },
>(user?: T | null): string {
  const first = user?.first_name?.trim();
  const last = user?.last_name?.trim();

  if (!first && !last) return '-';
  if (first && !last) return first.charAt(0).toUpperCase();
  if (!first && last) return last.charAt(0).toUpperCase();
  return `${first!.charAt(0)}${last!.charAt(0)}`.toUpperCase();
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: readonly K[],
): Omit<T, K> {
  const result: Partial<T> = {};

  (Object.keys(obj) as (keyof T)[]).forEach(key => {
    if (!keys.includes(key as K)) {
      result[key] = obj[key];
    }
  });

  return result as Omit<T, K>;
}

export function isWorkingDay(date: Date): boolean {
  // getDay: 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return getDay(date) !== 1; // Monday is considered a holiday
}

export function getWorkingDaysCount(
  start: Date | string,
  end: Date | string,
): number {
  const startDate = typeof start === 'string' ? parseISO(start) : start;
  const endDate = typeof end === 'string' ? parseISO(end) : end;

  const allDates = eachDayOfInterval({ start: startDate, end: endDate });

  const workingDays = allDates.filter(isWorkingDay);

  return workingDays.length;
}

export function toHumanReadableDate(
  date: Date | string,
  baseDate: Date = new Date(),
): string {
  const targetDate = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(targetDate)) return 'today';
  if (isTomorrow(targetDate)) return 'tomorrow';
  if (isYesterday(targetDate)) return 'yesterday';

  const dayDifference = differenceInCalendarDays(targetDate, baseDate);

  if (dayDifference >= 7 && dayDifference <= 13) {
    return `next ${format(targetDate, 'EEEE')}`;
  }

  if (dayDifference > 0) {
    return `in ${dayDifference} days`;
  }

  return `${Math.abs(dayDifference)} days ago`;
}
