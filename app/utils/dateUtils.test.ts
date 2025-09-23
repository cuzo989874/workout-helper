import { describe, it, expect } from 'vitest';

import {
  formatTimestampWithLanguage,
  getCurrentDateWithLanguage,
  formatDateAsNumeric,
} from './dateUtils';

describe('utils/dateUtils', () => {
  describe('formatTimestampWithLanguage', () => {
    it('formats time with zh timezone (Asia/Taipei)', () => {
      const ts = Date.UTC(2024, 0, 2, 6, 30, 0); // 2024-01-02T06:30:00Z
      const formatted = formatTimestampWithLanguage(ts, 'zh', 'time');
      // Should be HH:MM 24h format
      expect(/\d{2}:\d{2}/.test(formatted)).toBe(true);
    });

    it('formats date with vi timezone (Asia/Ho_Chi_Minh)', () => {
      const ts = Date.UTC(2024, 5, 10, 12, 0, 0);
      const formatted = formatTimestampWithLanguage(ts, 'vi', 'date');
      // For vi-VN, order is typically DD-MM-YYYY after replacement; accept either
      const isYYYYMMDD = /^\d{4}-\d{2}-\d{2}$/.test(formatted);
      const isDDMMYYYY = /^\d{2}-\d{2}-\d{4}$/.test(formatted);
      expect(isYYYYMMDD || isDDMMYYYY).toBe(true);
    });

    it('formats datetime with default language fallback', () => {
      const ts = Date.UTC(2023, 11, 31, 23, 59, 0);
      const formatted = formatTimestampWithLanguage(ts, 'en', 'datetime');
      expect(/\d{4}-\d{2}-\d{2}/.test(formatted)).toBe(true);
    });
  });

  describe('getCurrentDateWithLanguage', () => {
    it('returns a valid date string for zh', () => {
      const str = getCurrentDateWithLanguage('zh');
      expect(typeof str).toBe('string');
      // new Date should be able to parse when fed back with same tz is not guaranteed,
      // but ensure it is non-empty
      expect(str.length).toBeGreaterThan(0);
    });
  });

  describe('formatDateAsNumeric', () => {
    it('formats date to YYYY-MM-DD', () => {
      const d = new Date(2024, 8, 7); // 2024-09-07
      expect(formatDateAsNumeric(d)).toBe('2024-09-07');
    });
    it('pads month and day with zero', () => {
      const d = new Date(2024, 0, 5); // 2024-01-05
      expect(formatDateAsNumeric(d)).toBe('2024-01-05');
    });
  });
});
