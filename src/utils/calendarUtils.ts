import type { IWorkout } from '~/interface/workout';
import { formatDateAsNumeric } from './dateUtils';

/**
 * Represents a single day in the calendar grid
 */
export interface ICalendarDay {
  /**
   * Date string in YYYY-MM-DD format
   */
  date: string;
  /**
   * Day of month (1-31)
   */
  dayOfMonth: number;
  /**
   * Whether this date is in the displayed month
   */
  isCurrentMonth: boolean;
  /**
   * Whether this date is today
   */
  isToday: boolean;
}

/**
 * Compute the calendar grid days for a given month
 * Returns 35-42 days to fill the calendar grid (5-6 weeks)
 * Week starts on Monday
 *
 * @param year - The year (e.g., 2025)
 * @param month - The month (0-11, where 0 is January)
 * @returns Array of calendar days
 */
export function computeCalendarDays(
  year: number,
  month: number
): ICalendarDay[] {
  const days: ICalendarDay[] = [];

  // Get first day of the month
  const firstDayOfMonth = new Date(year, month, 1);

  // Get day of week for first day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  let firstDayOfWeek = firstDayOfMonth.getDay();

  // Adjust so Monday = 0, Sunday = 6
  firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  // Calculate how many days to show from previous month
  const daysFromPrevMonth = firstDayOfWeek;

  // Calculate total days to show
  const totalDays = 42;

  // Get today's date string for comparison
  const todayString = formatDateAsNumeric(new Date());

  // Generate calendar days
  for (let i = 0; i < totalDays; i++) {
    // Calculate the actual date for this position
    const dayOffset = i - daysFromPrevMonth;
    const date = new Date(year, month, dayOffset + 1);

    const dateString = formatDateAsNumeric(date);

    days.push({
      date: dateString,
      dayOfMonth: date.getDate(),
      isCurrentMonth: date.getMonth() === month,
      isToday: dateString === todayString,
    });
  }

  return days;
}

/**
 * Group workouts by their date
 *
 * @param workouts - Array of workouts
 * @returns Map of date string to array of workouts
 */
export function groupWorkoutsByDate(
  workouts: IWorkout[]
): Map<string, IWorkout[]> {
  const grouped = new Map<string, IWorkout[]>();

  for (const workout of workouts) {
    const date = workout.date;

    if (!grouped.has(date)) {
      grouped.set(date, []);
    }

    grouped.get(date)!.push(workout);
  }

  return grouped;
}

/**
 * Get the localized month name
 *
 * @param month - Month number (0-11)
 * @param locale - Locale string (e.g., 'en', 'zh')
 * @returns Localized month name
 */
export function getMonthName(month: number, locale: string): string {
  const date = new Date(2000, month, 1);
  return date.toLocaleString(locale, { month: 'long' });
}
