import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { startOfISOWeek, addDays, setISOWeek, setYear, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates the dates of the week (Monday to Sunday) for a given ISO week number and year.
 *
 * @param {number} weekNumber - The ISO week number (1–53).
 * @param {number} year - The year (e.g. 2025).
 * @returns {Array<{ day: string, date: string }>} - An array of objects with day name and date (YYYY-MM-DD).
 */
export function getWeekDates(
  weekNumber: number,
  year: number
): { day: string; date: string }[] {
  // Start from the first ISO week of the year
  let date = startOfISOWeek(setISOWeek(setYear(new Date(), year), weekNumber));

  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDay = addDays(date, i);
    days.push({
      day: format(currentDay, "EEE"), // Full name of the day (e.g., "Mon")
      date: format(currentDay, "dd"), // ISO format date
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
  id: T | null | undefined | ""
) {
  if (id === null || id === undefined || id === "") {
    return undefined;
  }

  return { [key]: { connect: { id } } };
}
