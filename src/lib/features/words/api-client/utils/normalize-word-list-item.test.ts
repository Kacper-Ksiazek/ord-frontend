import { describe, expect, it } from 'vitest';
import type { WordListItem } from '$words/types';
import { getWordBookmarked, normalizeWordListItem } from './normalize-word-list-item';

describe('normalizeWordListItem', () => {
	it('reads bookmarked from isBookmarked when bookmarked is missing', () => {
		const item = normalizeWordListItem({
			id: 'word-1',
			isBookmarked: true
		} as WordListItem & { isBookmarked?: boolean });

		expect(getWordBookmarked(item)).toBe(true);
		expect(item.bookmarked).toBe(true);
	});

	it('prefers bookmarked when both fields are present', () => {
		const item = normalizeWordListItem({
			id: 'word-1',
			bookmarked: false,
			isBookmarked: true
		} as WordListItem & { isBookmarked?: boolean });

		expect(getWordBookmarked(item)).toBe(false);
	});
});
