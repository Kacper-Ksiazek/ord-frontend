import type { WordsInboxViewMode } from '$words/types';
import { WordsListFiltersState, type WordsListFilters } from './words-list-filters-state.svelte';

const WORD_ID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type WordsInboxUrlState = {
	filters: WordsListFilters;
	viewMode: WordsInboxViewMode;
	wordId: string | null;
};

function parseWordId(value: string | null): string | null {
	if (!value) {
		return null;
	}

	const trimmed = value.trim();

	return WORD_ID_PATTERN.test(trimmed) ? trimmed : null;
}

function parseViewMode(value: string | null): WordsInboxViewMode {
	return value === 'analytics' ? 'analytics' : 'list';
}

export function parseWordsInboxUrl(searchParams: URLSearchParams): WordsInboxUrlState {
	return {
		filters: WordsListFiltersState.parseSearchParams(searchParams),
		viewMode: parseViewMode(searchParams.get('view')),
		wordId: parseWordId(searchParams.get('wordId'))
	};
}

export function buildWordsInboxQueryString(state: WordsInboxUrlState): string {
	const parts: string[] = [];
	const filtersQuery = WordsListFiltersState.filtersToQueryString(state.filters);

	if (filtersQuery) {
		parts.push(filtersQuery);
	}

	if (state.viewMode === 'analytics') {
		parts.push('view=analytics');
	}

	if (state.wordId) {
		parts.push(`wordId=${encodeURIComponent(state.wordId)}`);
	}

	return parts.join('&');
}
