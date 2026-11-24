import { describe, expect, it } from 'vitest';
import { buildExamplesPreviousExplanation } from './build-examples-previous-explanation';

describe('buildExamplesPreviousExplanation', () => {
	describe('positive path', () => {
		it('should append shown examples as prefixed lines after a blank line', () => {
			const result = buildExamplesPreviousExplanation('Using very few words.', [
				'His reply was laconic.',
				'A laconic note.'
			]);

			expect(result).toBe('Using very few words.\n\n» His reply was laconic.\n» A laconic note.');
		});
	});

	describe('negative path', () => {
		it('should return only the trimmed definition when nothing was shown yet', () => {
			const result = buildExamplesPreviousExplanation('  Using very few words.  ', []);

			expect(result).toBe('Using very few words.');
		});
	});

	describe('edge cases', () => {
		it('should skip blank examples', () => {
			const result = buildExamplesPreviousExplanation('Def.', ['  ', 'One.']);

			expect(result).toBe('Def.\n\n» One.');
		});
	});
});
