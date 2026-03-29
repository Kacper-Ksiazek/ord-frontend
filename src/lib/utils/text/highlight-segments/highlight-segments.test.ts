import { describe, it, expect } from 'vitest';
import { highlightText } from './highlight-segments';

describe('highlightText', () => {
	describe('positive path', () => {
		it('should return plain and highlighted parts for matching phrases', () => {
			const result = highlightText('The cat sat', [{ text: 'cat', category: 'noun' }]);

			expect(result).toEqual([{ text: 'The ' }, { text: 'cat', highlight: 'noun' }, { text: ' sat' }]);
		});

		it('should aggregate ranges from multiple highlight pairs', () => {
			const result = highlightText('ab cd ab', [
				{ text: 'ab', category: 'first' },
				{ text: 'cd', category: 'second' }
			]);

			expect(result).toEqual([
				{ text: 'ab', highlight: 'first' },
				{ text: ' ' },
				{ text: 'cd', highlight: 'second' },
				{ text: ' ' },
				{ text: 'ab', highlight: 'first' }
			]);
		});

		it('should apply priorityMap when ranges overlap', () => {
			const result = highlightText(
				'abcde',
				[
					{ text: 'bcd', category: 'low' },
					{ text: 'c', category: 'high' }
				],
				{
					low: 1,
					high: 10
				}
			);

			expect(result).toEqual([{ text: 'ab' }, { text: 'c', highlight: 'high' }, { text: 'de' }]);
		});
	});

	describe('negative path', () => {
		it('should return a single unhighlighted part when highlights is empty', () => {
			const result = highlightText('unchanged', []);

			expect(result).toEqual([{ text: 'unchanged' }]);
		});
	});

	describe('edge cases', () => {
		it('should return a single part with empty text when content is empty', () => {
			const result = highlightText('', [{ text: 'x', category: 'c' }]);

			expect(result).toEqual([{ text: '' }]);
		});

		it('should ignore highlight pairs whose text is only whitespace', () => {
			const result = highlightText('hello', [
				{ text: '   ', category: 'x' },
				{ text: 'ell', category: 'mid' }
			]);

			expect(result).toEqual([{ text: 'h' }, { text: 'ell', highlight: 'mid' }, { text: 'o' }]);
		});

		it('should ignore highlight pairs with empty string text', () => {
			const result = highlightText('hello', [{ text: '', category: 'x' }]);

			expect(result).toEqual([{ text: 'hello' }]);
		});
	});
});
