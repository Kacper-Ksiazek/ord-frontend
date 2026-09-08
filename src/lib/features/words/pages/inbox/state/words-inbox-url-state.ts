import type { WordsViewMode } from '$words/types';
import { WordsListFiltersState, type WordsListFilters } from './words-list-filters-state.svelte';

const WORD_ID_PATTERN =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export type WordsInboxUrlState = {
	filters: WordsListFilters;
	viewMode: WordsViewMode;
	wordId: string | null;
	page: number;
};

function parseWordId(value: string | null): string | null {
	if (!value) {
		return null;
	}

	const trimmed = value.trim();

	return WORD_ID_PATTERN.test(trimmed) ? trimmed : null;
}

function parsePage(value: string | null): number {
	if (!value) {
		return 0;
	}

	const parsed = Number.parseInt(value, 10);

	return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function parseWordsInboxUrl(searchParams: URLSearchParams): WordsInboxUrlState {
	const viewParam = searchParams.get('view');

	return {
		filters: WordsListFiltersState.parseSearchParams(searchParams),
		viewMode: viewParam === 'pending' ? 'pending' : 'learning',
		wordId: parseWordId(searchParams.get('wordId')),
		page: parsePage(searchParams.get('page'))
	};
}

export function buildWordsInboxQueryString(state: WordsInboxUrlState): string {
	const parts: string[] = [];
	const filtersQuery = WordsListFiltersState.filtersToQueryString(state.filters);

	if (filtersQuery) {
		parts.push(filtersQuery);
	}

	if (state.viewMode === 'pending') {
		parts.push('view=pending');
	}

	if (state.wordId) {
		parts.push(`wordId=${encodeURIComponent(state.wordId)}`);
	}

	if (state.page > 0) {
		parts.push(`page=${state.page}`);
	}

	return parts.join('&');
}
