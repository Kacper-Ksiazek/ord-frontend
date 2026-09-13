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

	it('builds search payload', () => {
		const state = new WordsListFiltersState(new URLSearchParams('search=test&wordTypes=IDIOM'));

		const payload = state.buildSearchPayload({
			language: 'ENGLISH',
			learningPerPage: 500
		});

		expect(payload).toEqual({
			language: 'ENGLISH',
			page: 0,
			perPage: 500,
			sortBy: 'CREATED_AT',
			sortDirection: 'DESC',
			searchingPhrase: 'test',
			wordTypes: ['IDIOM']
		});
	});

	it('builds search payload with bookmarked filter', () => {
		const state = new WordsListFiltersState(new URLSearchParams('bookmarkedOnly=true'));

		const payload = state.buildSearchPayload({
			language: 'ENGLISH',
			learningPerPage: 500
		});

		expect(payload).toMatchObject({
			bookmarked: true
		});
		expect(state.hasActiveFilters).toBe(true);
	});

	it('clears filters', () => {
		const state = new WordsListFiltersState(new URLSearchParams('search=test'));
		state.clearFilters();

		expect(state.hasActiveFilters).toBe(false);
		expect(state.toQueryString()).toBe('');
	});
});
