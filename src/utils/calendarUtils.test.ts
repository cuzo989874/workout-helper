import { describe, it, expect } from 'vitest';
import {
  computeCalendarDays,
  groupWorkoutsByDate,
  getMonthName,
} from './calendarUtils';
import type { IWorkout } from '~/interface/workout';

describe('calendarUtils', () => {
  describe('computeCalendarDays', () => {
    it('should return an array of calendar days', () => {
      const days = computeCalendarDays(2025, 9); // October 2025
      expect(Array.isArray(days)).toBe(true);
      expect(days.length).toBeGreaterThanOrEqual(35);
      expect(days.length).toBeLessThanOrEqual(42);
    });

    it('should start from Monday (week starts Monday)', () => {
      const days = computeCalendarDays(2025, 9); // October 2025
      const firstDay = new Date(days[0].date);
      // The calendar should always start on Monday (getDay() = 1)
      // October 1, 2025 is Wednesday, so calendar starts from Sep 29 (Monday)
      expect(firstDay.getDay()).toBe(1);
      // Verify it's actually September 29, 2025
      expect(days[0].date).toBe('2025-09-29');
    });

    it('should include correct dates from October 2025', () => {
      const days = computeCalendarDays(2025, 9); // October 2025

      // Find October 1st
      const oct1 = days.find(day => day.date === '2025-10-01');
      expect(oct1).toBeDefined();
      expect(oct1?.dayOfMonth).toBe(1);
      expect(oct1?.isCurrentMonth).toBe(true);

      // Find October 31st
      const oct31 = days.find(day => day.date === '2025-10-31');
      expect(oct31).toBeDefined();
      expect(oct31?.dayOfMonth).toBe(31);
      expect(oct31?.isCurrentMonth).toBe(true);
    });

    it('should mark dates outside current month as not current month', () => {
      const days = computeCalendarDays(2025, 9); // October 2025

      // September dates should be marked as not current month
      const septemberDays = days.filter(day => day.date.startsWith('2025-09'));
      septemberDays.forEach(day => {
        expect(day.isCurrentMonth).toBe(false);
      });

      // November dates should be marked as not current month
      const novemberDays = days.filter(day => day.date.startsWith('2025-11'));
      novemberDays.forEach(day => {
        expect(day.isCurrentMonth).toBe(false);
      });
    });

    it("should correctly identify today's date", () => {
      const today = new Date();
      const days = computeCalendarDays(today.getFullYear(), today.getMonth());

      const todayString = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`;
      const todayDay = days.find(day => day.date === todayString);

      expect(todayDay).toBeDefined();
      expect(todayDay?.isToday).toBe(true);
    });

    it('should handle February in a leap year correctly', () => {
      const days = computeCalendarDays(2024, 1); // February 2024 (leap year)

      // Should include Feb 29th
      const feb29 = days.find(day => day.date === '2024-02-29');
      expect(feb29).toBeDefined();
      expect(feb29?.isCurrentMonth).toBe(true);
    });

    it('should handle December to January transition', () => {
      const days = computeCalendarDays(2025, 11); // December 2025

      // Should include some January 2026 dates
      const januaryDays = days.filter(day => day.date.startsWith('2026-01'));
      expect(januaryDays.length).toBeGreaterThan(0);
      januaryDays.forEach(day => {
        expect(day.isCurrentMonth).toBe(false);
      });
    });
  });

  describe('groupWorkoutsByDate', () => {
    it('should return an empty Map for empty workout array', () => {
      const result = groupWorkoutsByDate([]);
      expect(result).toBeInstanceOf(Map);
      expect(result.size).toBe(0);
    });

    it('should group workouts by date correctly', () => {
      const workouts: IWorkout[] = [
        {
          id: '1',
          date: '2025-10-07',
          description: 'Morning workout',
          exerciseList: [],
        },
        {
          id: '2',
          date: '2025-10-07',
          description: 'Evening workout',
          exerciseList: [],
        },
        {
          id: '3',
          date: '2025-10-08',
          description: 'Leg day',
          exerciseList: [],
        },
      ];

      const result = groupWorkoutsByDate(workouts);

      expect(result.size).toBe(2);
      expect(result.get('2025-10-07')).toHaveLength(2);
      expect(result.get('2025-10-08')).toHaveLength(1);
    });

    it('should handle workouts with different date formats gracefully', () => {
      const workouts: IWorkout[] = [
        {
          id: '1',
          date: '2025-10-07',
          description: 'Workout 1',
          exerciseList: [],
        },
      ];

      const result = groupWorkoutsByDate(workouts);
      expect(result.get('2025-10-07')).toHaveLength(1);
    });

    it('should maintain workout order within the same date', () => {
      const workouts: IWorkout[] = [
        {
          id: '1',
          date: '2025-10-07',
          description: 'First',
          exerciseList: [],
        },
        {
          id: '2',
          date: '2025-10-07',
          description: 'Second',
          exerciseList: [],
        },
        {
          id: '3',
          date: '2025-10-07',
          description: 'Third',
          exerciseList: [],
        },
      ];

      const result = groupWorkoutsByDate(workouts);
      const oct7Workouts = result.get('2025-10-07')!;

      expect(oct7Workouts[0].description).toBe('First');
      expect(oct7Workouts[1].description).toBe('Second');
      expect(oct7Workouts[2].description).toBe('Third');
    });
  });

  describe('getMonthName', () => {
    it('should return month name in English', () => {
      expect(getMonthName(0, 'en')).toBe('January');
      expect(getMonthName(6, 'en')).toBe('July');
      expect(getMonthName(11, 'en')).toBe('December');
    });

    it('should handle different locales', () => {
      const monthName = getMonthName(0, 'zh');
      expect(typeof monthName).toBe('string');
      expect(monthName.length).toBeGreaterThan(0);
    });

    it('should handle all 12 months', () => {
      for (let i = 0; i < 12; i++) {
        const monthName = getMonthName(i, 'en');
        expect(typeof monthName).toBe('string');
        expect(monthName.length).toBeGreaterThan(0);
      }
    });
  });
});
