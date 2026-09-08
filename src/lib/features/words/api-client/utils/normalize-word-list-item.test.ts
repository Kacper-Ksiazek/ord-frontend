import { describe, expect, it } from 'vitest';
import { getWordBookmarked, normalizeWordListItem } from './normalize-word-list-item';

describe('normalizeWordListItem', () => {
	it('reads bookmarked from isBookmarked when bookmarked is missing', () => {
		const item = normalizeWordListItem({
			id: 'word-1',
			isBookmarked: true
		});

		expect(getWordBookmarked(item)).toBe(true);
		expect(item.bookmarked).toBe(true);
	});

	it('prefers bookmarked when both fields are present', () => {
		const item = normalizeWordListItem({
			id: 'word-1',
			bookmarked: false,
			isBookmarked: true
		});

		expect(getWordBookmarked(item)).toBe(false);
	});
});
