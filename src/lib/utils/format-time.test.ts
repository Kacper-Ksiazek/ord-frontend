import { describe, it, expect } from 'vitest';
import { formatTime } from './format-time';

describe('formatTime', () => {
	describe('positive path', () => {
		it('should format seconds as m:ss', () => {
			expect(formatTime(65)).toBe('1:05');
		});

		it('should format zero seconds', () => {
			expect(formatTime(0)).toBe('0:00');
		});

		it('should format minutes without leading zero on minutes', () => {
			expect(formatTime(125)).toBe('2:05');
		});
	});

	describe('negative path', () => {
		it('should clamp negative values to zero', () => {
			expect(formatTime(-10)).toBe('0:00');
		});
	});

	describe('edge cases', () => {
		it('should floor fractional seconds', () => {
			expect(formatTime(59.9)).toBe('0:59');
		});

		it('should pad single-digit seconds', () => {
			expect(formatTime(9)).toBe('0:09');
		});
	});
});
