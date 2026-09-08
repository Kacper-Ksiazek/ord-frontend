import { describe, expect, it } from 'vitest';
import { buildWordsInboxQueryString, parseWordsInboxUrl } from './words-inbox-url-state';

describe('wordsInboxUrlState', () => {
	it('parses filters, view, word detail, and page from URL', () => {
		const parsed = parseWordsInboxUrl(
			new URLSearchParams(
				'search=cap&bookmarkedOnly=true&view=pending&page=2&wordId=463e0942-76f5-449a-827a-8c695aef1a06'
			)
		);

		expect(parsed.filters.search).toBe('cap');
		expect(parsed.filters.bookmarkedOnly).toBe(true);
		expect(parsed.viewMode).toBe('pending');
		expect(parsed.page).toBe(2);
		expect(parsed.wordId).toBe('463e0942-76f5-449a-827a-8c695aef1a06');
	});

	it('builds query string with filters, view, word detail, and page', () => {
		const query = buildWordsInboxQueryString({
			filters: {
				search: 'capricious',
				wordTypes: ['ADJECTIVE'],
				bankIds: [],
				wordExtraMarks: [],
				bookmarkedOnly: true
			},
			viewMode: 'learning',
			wordId: '463e0942-76f5-449a-827a-8c695aef1a06',
			page: 0
		});

		expect(query).toBe(
			'search=capricious&wordTypes=ADJECTIVE&bookmarkedOnly=true&wordId=463e0942-76f5-449a-827a-8c695aef1a06'
		);
	});

	it('omits default learning view and first page from URL', () => {
		const query = buildWordsInboxQueryString({
			filters: {
				search: '',
				wordTypes: [],
				bankIds: [],
				wordExtraMarks: [],
				bookmarkedOnly: false
			},
			viewMode: 'learning',
			wordId: null,
			page: 0
		});

		expect(query).toBe('');
	});
});
