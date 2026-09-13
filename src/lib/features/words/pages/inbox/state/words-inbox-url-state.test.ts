import { describe, expect, it } from 'vitest';
import { buildWordsInboxQueryString, parseWordsInboxUrl } from './words-inbox-url-state';

describe('wordsInboxUrlState', () => {
	it('parses filters and word detail from URL', () => {
		const parsed = parseWordsInboxUrl(
			new URLSearchParams('search=cap&bookmarkedOnly=true&wordId=463e0942-76f5-449a-827a-8c695aef1a06')
		);

		expect(parsed.filters.search).toBe('cap');
		expect(parsed.filters.bookmarkedOnly).toBe(true);
		expect(parsed.viewMode).toBe('list');
		expect(parsed.wordId).toBe('463e0942-76f5-449a-827a-8c695aef1a06');
	});

	it('parses analytics view from URL', () => {
		const parsed = parseWordsInboxUrl(new URLSearchParams('view=analytics'));

		expect(parsed.viewMode).toBe('analytics');
	});

	it('builds query string with filters and word detail', () => {
		const query = buildWordsInboxQueryString({
			filters: {
				search: 'capricious',
				wordTypes: ['ADJECTIVE'],
				bankIds: [],
				wordExtraMarks: [],
				bookmarkedOnly: true
			},
			viewMode: 'list',
			wordId: '463e0942-76f5-449a-827a-8c695aef1a06'
		});

		expect(query).toBe(
			'search=capricious&wordTypes=ADJECTIVE&bookmarkedOnly=true&wordId=463e0942-76f5-449a-827a-8c695aef1a06'
		);
	});

	it('omits empty filters from URL', () => {
		const query = buildWordsInboxQueryString({
			filters: {
				search: '',
				wordTypes: [],
				bankIds: [],
				wordExtraMarks: [],
				bookmarkedOnly: false
			},
			viewMode: 'list',
			wordId: null
		});

		expect(query).toBe('');
	});

	it('includes analytics view in URL', () => {
		const query = buildWordsInboxQueryString({
			filters: {
				search: '',
				wordTypes: [],
				bankIds: [],
				wordExtraMarks: [],
				bookmarkedOnly: false
			},
			viewMode: 'analytics',
			wordId: null
		});

		expect(query).toBe('view=analytics');
	});
});
