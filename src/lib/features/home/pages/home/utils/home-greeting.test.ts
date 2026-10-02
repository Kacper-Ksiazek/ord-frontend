import { describe, expect, it } from 'vitest';
import { firstNameFromDisplayName, homeGreetingPeriod } from './home-greeting';

function atHour(hour: number): Date {
	return new Date(2026, 9, 1, hour, 30, 0);
}

describe('homeGreetingPeriod', () => {
	it('should greet the morning from 5 until noon', () => {
		expect(homeGreetingPeriod(atHour(5))).toBe('morning');
		expect(homeGreetingPeriod(atHour(11))).toBe('morning');
	});

	it('should greet the afternoon from noon until 18', () => {
		expect(homeGreetingPeriod(atHour(12))).toBe('afternoon');
		expect(homeGreetingPeriod(atHour(17))).toBe('afternoon');
	});

	it('should greet the evening from 18 through the early morning', () => {
		expect(homeGreetingPeriod(atHour(18))).toBe('evening');
		expect(homeGreetingPeriod(atHour(23))).toBe('evening');
		expect(homeGreetingPeriod(atHour(0))).toBe('evening');
		expect(homeGreetingPeriod(atHour(4))).toBe('evening');
	});
});

describe('firstNameFromDisplayName', () => {
	it('should keep a single given name', () => {
		expect(firstNameFromDisplayName('Kacper')).toBe('Kacper');
	});

	it('should use the first word of a display name', () => {
		expect(firstNameFromDisplayName('  Kacper Książek  ')).toBe('Kacper');
	});

	it('should return an empty string when the profile has no name', () => {
		expect(firstNameFromDisplayName('   ')).toBe('');
		expect(firstNameFromDisplayName(null)).toBe('');
		expect(firstNameFromDisplayName(undefined)).toBe('');
	});
});
