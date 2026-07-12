import { describe, it, expect } from 'vitest';
import type { ConversationMessageMistake } from '$conversations/types';
import { computeMessagesStats } from './compute-message-stats';

function makeMistake(severity: ConversationMessageMistake['severity']): ConversationMessageMistake {
	return {
		phrase: 'mistake',
		correctForm: 'correct',
		explanation: 'explanation',
		severity,
		errorType: 'GRAMMAR'
	};
}

describe('computeMessagesStats', () => {
	describe('positive path', () => {
		it('should compute counts and percentage fractions by severity', () => {
			const mistakes = [
				makeMistake('MINOR'),
				makeMistake('MINOR'),
				makeMistake('MODERATE'),
				makeMistake('CRITICAL')
			];

			const result = computeMessagesStats(mistakes);

			expect(result.MINOR.count).toBe(2);
			expect(result.MODERATE.count).toBe(1);
			expect(result.CRITICAL.count).toBe(1);
			expect(result.MINOR.fraction).toBe(50);
			expect(result.MODERATE.fraction).toBe(25);
			expect(result.CRITICAL.fraction).toBe(25);
		});
	});

	describe('negative path', () => {
		it('should return zero counts for an empty mistake list', () => {
			const result = computeMessagesStats([]);

			expect(result.MINOR.count).toBe(0);
			expect(result.MODERATE.count).toBe(0);
			expect(result.CRITICAL.count).toBe(0);
			expect(Number.isNaN(result.MINOR.fraction)).toBe(true);
		});
	});

	describe('edge cases', () => {
		it('should expose chart colors and labels for each severity bucket', () => {
			const result = computeMessagesStats([makeMistake('MINOR')]);

			expect(result.MINOR.label).toBe('Minor');
			expect(result.MODERATE.label).toBe('Moderate');
			expect(result.CRITICAL.label).toBe('Critical');
			expect(result.MINOR.color).toBeTruthy();
			expect(result.MODERATE.color).toBeTruthy();
			expect(result.CRITICAL.color).toBeTruthy();
		});
	});
});
