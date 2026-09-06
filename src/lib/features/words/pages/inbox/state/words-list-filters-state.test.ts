import { describe, expect, it } from 'vitest';
import { WordsListFiltersState } from './words-list-filters-state.svelte';

describe('WordsListFiltersState', () => {
	it('parses search params', () => {
		const state = new WordsListFiltersState(
			new URLSearchParams('search=hello&wordTypes=NOUN,VERB&bankIds=abc&wordExtraMarks=SLANG')
		);

		expect(state.filters.search).toBe('hello');
		expect(state.filters.wordTypes).toEqual(['NOUN', 'VERB']);
		expect(state.filters.bankIds).toEqual(['abc']);
		expect(state.filters.wordExtraMarks).toEqual(['SLANG']);
		expect(state.hasActiveFilters).toBe(true);
	});

	it('builds search payload for learning view', () => {
		const state = new WordsListFiltersState(new URLSearchParams('search=test&wordTypes=IDIOM'));

		const payload = state.buildSearchPayload({
			language: 'ENGLISH',
			viewMode: 'learning',
			page: 2,
			learningPerPage: 500,
			pendingPerPage: 50
		});

		expect(payload).toEqual({
			language: 'ENGLISH',
			page: 0,
			perPage: 500,
			hasProgress: true,
			sortBy: 'CREATED_AT',
			sortDirection: 'DESC',
			searchingPhrase: 'test',
			wordTypes: ['IDIOM']
		});
	});

	it('clears filters', () => {
		const state = new WordsListFiltersState(new URLSearchParams('search=test'));
		state.clearFilters();

		expect(state.hasActiveFilters).toBe(false);
		expect(state.toQueryString()).toBe('');
	});
});
