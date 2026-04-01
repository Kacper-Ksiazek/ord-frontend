import { describe, it, expect } from 'vitest';
import { formatDateDayMonthYearTime } from './format-date-day-month-year-time';

describe('formatDateDayMonthYearTime', () => {
	it('should format a local Date as DD MM YYYY ⋅ HH MM', () => {
		const date = new Date(2026, 3, 1, 15, 7, 0);

		expect(formatDateDayMonthYearTime(date)).toBe('01 04 2026 ⋅ 15 07');
	});

	it('should accept numeric timestamps', () => {
		const ms = new Date(2026, 0, 9, 14, 30).getTime();

		expect(formatDateDayMonthYearTime(ms)).toBe('09 01 2026 ⋅ 14 30');
	});

	it('should return the original string when the value is not a valid date', () => {
		expect(formatDateDayMonthYearTime('not a date')).toBe('not a date');
	});
});
