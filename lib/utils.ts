import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RRule } from 'rrule';
import type { Weekday } from 'rrule';

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
  setMinutes,
  setHours,
  isBefore,
  addMinutes,
  startOfWeek,
  differenceInYears,
  set,
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
  if (!Array.isArray(ids)) return undefined;
  return { [key]: { connect: ids.map(id => ({ id })) } };
}

export function setManyIfDefined<T>(key: string, ids: T[] | null | undefined) {
  if (!Array.isArray(ids)) return undefined;
  return { [key]: { set: ids.map(id => ({ id })) } };
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

export function getInitialsFromName<T extends { name?: string | null }>(
  user?: T | null,
): string {
  const name = user?.name?.trim();
  if (!name) return '-';

  const parts = name.split(' ').filter(Boolean); // filter out empty parts
  if (parts.length === 0) return '-';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  const [first, last] = parts;
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
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

type TimeSlot = {
  label: string;
  id: string;
};

type GetTimeSlotsParams = {
  startHour?: number;
  endHour?: number;
  intervalMinutes?: number;
  filter?: string[];
};

export function getTimeSlots({
  startHour = 15,
  endHour = 21,
  intervalMinutes = 30,
  filter = [],
}: GetTimeSlotsParams): TimeSlot[] {
  const now = new Date();
  const startTime = setMinutes(setHours(now, startHour), 0);
  const endTime = setMinutes(setHours(now, endHour), 0);

  const slots: TimeSlot[] = [];

  let current = startTime;
  while (
    isBefore(current, endTime) ||
    current.getTime() === endTime.getTime()
  ) {
    const label = format(current, 'hh:mm a');
    const id = format(current, 'HH:mm');

    if (!filter.includes(label)) {
      slots.push({ label, id });
    }

    current = addMinutes(current, intervalMinutes);
  }

  return slots;
}

type WeekDay = {
  label: string;
  id: number;
};

type AllDays =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

type GetWeekDayParams = {
  filter?: AllDays[];
  weekStartOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6; // 0 = Sunday
  formatOptions?: { label?: string };
};

export function getWeekDays({
  filter = [],
  weekStartOn = 0,
  formatOptions,
}: GetWeekDayParams): WeekDay[] {
  const weekStart = startOfWeek(new Date(), { weekStartsOn: weekStartOn });
  const labelFormat = formatOptions?.label || 'EEE';

  return Array.from({ length: 7 }).reduce<WeekDay[]>((acc, _, i) => {
    const date = addDays(weekStart, i);
    const dayName = format(date, 'EEEE');
    if (!filter.includes(dayName as AllDays)) {
      acc.push({
        label: format(date, labelFormat),
        id: i,
      });
    }
    return acc;
  }, []);
}

/**
 * Converts a decimal price (e.g. 100.00) into an integer (e.g. 10000)
 * for storage in the DB, avoiding floating point precision issues.
 */
export function priceToInt(price: number): number {
  return Math.round(price * 100);
}

/**
 * Converts an integer price from the DB (e.g. 10000) into a decimal
 * (e.g. 100.00) for display/use in application.
 */

const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

export function priceFromInt(priceInt: number): string {
  return formatter.format(priceInt / 100) as unknown as string;
}

export function verifyAndCreateEntry<T extends string | number>(
  key: string,
  value?: T,
): Record<string, T> | object {
  if (value === undefined) {
    return {};
  } else if (typeof value === 'number') {
    return { [key]: Number(value) };
  } else if (!isNaN(parseFloat(value ?? '')) && isFinite(Number(value))) {
    return { [key]: priceToInt(Number(value)) };
  }
  return {};
}

/**
 * Calculates the age in years given a birth date.
 * @param birthDate - The date of birth as a Date object.
 * @returns Age in years as a number.
 */
export function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = differenceInYears(today, birthDate);

  const thisYearBirthday = new Date(
    today.getFullYear(),
    birthDate.getMonth(),
    birthDate.getDate(),
  );

  if (isBefore(today, thisYearBirthday)) {
    age--;
  }

  return age;
}

const WEEKDAY_MAP: Record<number, Weekday> = {
  0: RRule.SU,
  1: RRule.MO,
  2: RRule.TU,
  3: RRule.WE,
  4: RRule.TH,
  5: RRule.FR,
  6: RRule.SA,
};

/**
 * Compute an array of event datetimes (start + end) based on:
 *  - totalSlots: total number of sessions needed
 *  - preferred_time_slots: { [weekdayNumber: string]: string[] }
 *       keys must be JS-style getDay() numbers (0=Sunday..6=Saturday)
 *  - enrollmentStartDate: an ISO date string (e.g. "2025-06-20")
 *  - durationMinutes: how long each session lasts
 *
 * Returns array of length totalSlots of objects { start: Date, end: Date }, sorted ascending by start.
 */
export function computeEventTimes(
  totalSlots: number,
  preferred_time_slots: Record<string, string[]>,
  enrollmentStartDate: Date | string,
  durationMinutes: number = 60,
): { start: Date; end: Date }[] {
  const startDate: Date =
    enrollmentStartDate instanceof Date
      ? enrollmentStartDate
      : parseISO(enrollmentStartDate);

  const rules: RRule[] = [];

  for (const [dayKey, times] of Object.entries(preferred_time_slots)) {
    const weekdayNum = Number(dayKey);
    if (
      Number.isNaN(weekdayNum) ||
      weekdayNum < 0 ||
      weekdayNum > 6 ||
      !Array.isArray(times)
    ) {
      continue;
    }

    const weekday = WEEKDAY_MAP[weekdayNum];
    if (!weekday) continue;

    for (const timeStr of times) {
      const [hhStr, mmStr] = timeStr.split(':');
      const hh = Number(hhStr),
        mm = Number(mmStr);
      if (
        Number.isNaN(hh) ||
        Number.isNaN(mm) ||
        hh < 0 ||
        hh > 23 ||
        mm < 0 ||
        mm > 59
      ) {
        continue;
      }

      let first = set(startDate, {
        hours: hh,
        minutes: mm,
        seconds: 0,
        milliseconds: 0,
      });

      const startWeekday = getDay(startDate);
      let deltaDays = (weekdayNum - startWeekday + 7) % 7;

      if (deltaDays === 0 && isBefore(first, startDate)) {
        deltaDays = 7;
      }
      if (deltaDays > 0) {
        first = addDays(first, deltaDays);
      }

      rules.push(
        new RRule({
          freq: RRule.WEEKLY,
          dtstart: first,
          byweekday: [weekday],
          count: totalSlots,
        }),
      );
    }
  }

  if (rules.length === 0) {
    throw new Error(
      'No valid preferred_time_slots entries found to build recurrence rules.',
    );
  }

  const allDates: Date[] = [];
  for (const rule of rules) {
    allDates.push(...rule.all().slice(0, totalSlots));
  }
  allDates.sort((a, b) => a.getTime() - b.getTime());

  const selected = allDates.slice(0, totalSlots);
  if (selected.length < totalSlots) {
    throw new Error(
      `Could only compute ${selected.length} occurrences, fewer than totalSlots=${totalSlots}`,
    );
  }

  return selected.map(dt => ({
    start: dt,
    end: addMinutes(dt, durationMinutes),
  }));
}

export function removeEmptyArrays(
  obj: Record<string, string[]>,
): Record<string, string[]> {
  const result: Record<string, string[]> = {};

  for (const key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length > 0) {
      result[key] = obj[key];
    }
  }

  return result;
}
