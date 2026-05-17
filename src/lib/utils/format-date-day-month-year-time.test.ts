import { describe, it, expect } from 'vitest';
import { formatDateDayMonthYearTime } from './format-date-day-month-year-time';

describe('formatDateDayMonthYearTime', () => {
	it('should format a local Date with medium date and 24h time (en-US)', () => {
		const date = new Date(2026, 3, 1, 15, 7, 0);

		expect(formatDateDayMonthYearTime(date, { locale: 'en-US' })).toBe('Apr 1, 2026, 15:07');
	});

	it('should accept numeric timestamps', () => {
		const ms = new Date(2026, 0, 9, 14, 30).getTime();

		expect(formatDateDayMonthYearTime(ms, { locale: 'en-US' })).toBe('Jan 9, 2026, 14:30');
	});

	it('should return the original string when the value is not a valid date', () => {
		expect(formatDateDayMonthYearTime('not a date')).toBe('not a date');
	});
});
