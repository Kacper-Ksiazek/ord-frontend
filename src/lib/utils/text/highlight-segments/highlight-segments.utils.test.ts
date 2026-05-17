import { describe, it, expect } from 'vitest';
import { buildHighlightParts, findTextRanges, mergeRanges } from './highlight-segments.utils';
import type { HighlightRange } from './highlight-segments.types';

describe('findTextRanges', () => {
	describe('positive path', () => {
		it('should return ranges with correct indices category and matched text for each occurrence', () => {
			const result = findTextRanges('cat', 'The cat sat near another cat', 'animal');

			expect(result).toEqual([
				{ start: 4, end: 7, category: 'animal', text: 'cat' },
				{ start: 25, end: 28, category: 'animal', text: 'cat' }
			]);
		});

		it('should match case-insensitively', () => {
			const result = findTextRanges('Ab', 'xx aB xx', 'x');

			expect(result).toEqual([{ start: 3, end: 5, category: 'x', text: 'aB' }]);
		});

		it('should treat regex metacharacters as literals', () => {
			const result = findTextRanges('a+b', 'prefix a+b suffix', 'op');

			expect(result).toEqual([{ start: 7, end: 10, category: 'op', text: 'a+b' }]);
		});
	});

	describe('negative path', () => {
		it('should return an empty array when the needle is not found', () => {
			const result = findTextRanges('missing', 'hello world', 'c');

			expect(result).toEqual([]);
		});
	});

	describe('edge cases', () => {
		it('should return an empty array when content is empty', () => {
			const result = findTextRanges('x', '', 'c');

			expect(result).toEqual([]);
		});

		it('should return one range for a single-character match at the start', () => {
			const result = findTextRanges('a', 'abc', 'c');

			expect(result).toEqual([{ start: 0, end: 1, category: 'c', text: 'a' }]);
		});
	});
});

describe('mergeRanges', () => {
	describe('positive path', () => {
		it('should return non-overlapping ranges unchanged in order of start', () => {
			const a: HighlightRange<'x'> = { start: 0, end: 2, category: 'x', text: 'ab' };
			const b: HighlightRange<'y'> = { start: 4, end: 6, category: 'y', text: 'cd' };

			const result = mergeRanges([b, a]);

			expect(result).toEqual([a, b]);
		});

		it('should extend the current range when overlapping ranges share the same priority', () => {
			const first: HighlightRange<'same'> = {
				start: 0,
				end: 4,
				category: 'same',
				text: 'abcd'
			};
			const second: HighlightRange<'same'> = {
				start: 2,
				end: 7,
				category: 'same',
				text: 'cdefg'
			};

			const result = mergeRanges([first, second], { same: 0 });

			expect(result).toEqual([{ start: 0, end: 7, category: 'same', text: 'abcd' }]);
		});

		it('should replace the current range when the overlapping range has higher priority', () => {
			const low: HighlightRange<'a'> = { start: 0, end: 6, category: 'a', text: 'aaaaaa' };
			const high: HighlightRange<'b'> = { start: 2, end: 4, category: 'b', text: 'aa' };

			const result = mergeRanges([low, high], { a: 1, b: 10 });

			expect(result).toEqual([high]);
		});
	});

	describe('negative path', () => {
		it('should return an empty array when ranges is empty', () => {
			const result = mergeRanges<string>([]);

			expect(result).toEqual([]);
		});
	});

	describe('edge cases', () => {
		it('should return a single-element array when given one range', () => {
			const only: HighlightRange<'z'> = { start: 1, end: 3, category: 'z', text: 'xx' };

			const result = mergeRanges([only]);

			expect(result).toEqual([only]);
		});

		it('should keep the higher-priority overlapping range when it is strictly inside the lower one', () => {
			const a: HighlightRange<'a'> = { start: 0, end: 3, category: 'a', text: 'aaa' };
			const b: HighlightRange<'b'> = { start: 1, end: 2, category: 'b', text: 'b' };

			const result = mergeRanges([a, b], { a: 5, b: 10 });

			expect(result).toEqual([b]);
		});

		it('should keep the wider range when the overlapping range has lower mapped priority', () => {
			const known: HighlightRange<'known'> = {
				start: 0,
				end: 5,
				category: 'known',
				text: 'xxxxx'
			};
			const unknown: HighlightRange<'other'> = {
				start: 2,
				end: 4,
				category: 'other',
				text: 'xx'
			};

			const result = mergeRanges([known, unknown], { known: 1, other: 0 });

			expect(result).toEqual([known]);
		});
	});
});

describe('buildHighlightParts', () => {
	describe('positive path', () => {
		it('should split content into plain and highlighted parts for merged ranges', () => {
			const merged: HighlightRange<'h'>[] = [{ start: 1, end: 4, category: 'h', text: 'bcd' }];

			const result = buildHighlightParts('abcdef', merged);

			expect(result).toEqual([{ text: 'a' }, { text: 'bcd', highlight: 'h' }, { text: 'ef' }]);
		});

		it('should produce only highlighted segments when the whole string is covered', () => {
			const merged: HighlightRange<'all'>[] = [{ start: 0, end: 3, category: 'all', text: 'xyz' }];

			const result = buildHighlightParts('xyz', merged);

			expect(result).toEqual([{ text: 'xyz', highlight: 'all' }]);
		});
	});

	describe('negative path', () => {
		it('should return a single unhighlighted part when merged ranges is empty', () => {
			const result = buildHighlightParts('only plain', []);

			expect(result).toEqual([{ text: 'only plain' }]);
		});
	});

	describe('edge cases', () => {
		it('should return one empty text part when content and ranges are empty', () => {
			const result = buildHighlightParts('', []);

			expect(result).toEqual([{ text: '' }]);
		});

		it('should handle adjacent ranges without inserting empty plain parts', () => {
			const merged: HighlightRange<'a' | 'b'>[] = [
				{ start: 0, end: 2, category: 'a', text: 'ab' },
				{ start: 2, end: 4, category: 'b', text: 'cd' }
			];

			const result = buildHighlightParts('abcd', merged);

			expect(result).toEqual([
				{ text: 'ab', highlight: 'a' },
				{ text: 'cd', highlight: 'b' }
			]);
		});
	});
});
