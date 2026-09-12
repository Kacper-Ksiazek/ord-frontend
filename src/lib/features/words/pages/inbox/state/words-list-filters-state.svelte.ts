import { WORD_EXTRA_MARKS, WORD_TYPES } from '$words/shared/constants/enum-values';
import type { WordExtraMark, WordType } from '$words/types';
import type { BuildSearchWordsParamsInput, SearchWordsParams } from '$words/types/api/search-words';

export interface WordsListFilters {
	search: string;
	wordTypes: WordType[];
	bankIds: string[];
	wordExtraMarks: WordExtraMark[];
	bookmarkedOnly: boolean;
}

function parseEnumList<T extends string>(value: string | null, allowed: readonly T[]): T[] {
	if (!value) {
		return [];
	}

	return value
		.split(',')
		.map((item) => item.trim())
		.filter((item): item is T => allowed.includes(item as T));
}

function parseStringList(value: string | null): string[] {
	if (!value) {
		return [];
	}

	return value
		.split(',')
		.map((item) => item.trim())
		.filter(Boolean);
}

function filtersEqual(a: WordsListFilters, b: WordsListFilters): boolean {
	return (
		a.search === b.search &&
		a.wordTypes.join(',') === b.wordTypes.join(',') &&
		a.bankIds.join(',') === b.bankIds.join(',') &&
		a.wordExtraMarks.join(',') === b.wordExtraMarks.join(',') &&
		a.bookmarkedOnly === b.bookmarkedOnly
	);
}

export class WordsListFiltersState {
	private static readonly DEFAULT_FILTERS: WordsListFilters = {
		search: '',
		wordTypes: [],
		bankIds: [],
		wordExtraMarks: [],
		bookmarkedOnly: false
	};

	filters: WordsListFilters = $state({
		...WordsListFiltersState.DEFAULT_FILTERS
	});

	constructor(urlSearchParams: URLSearchParams) {
		this.applyFromSearchParams(urlSearchParams);
	}

	static parseSearchParams(urlSearchParams: URLSearchParams): WordsListFilters {
		return {
			search: urlSearchParams.get('search') ?? '',
			wordTypes: parseEnumList(urlSearchParams.get('wordTypes'), WORD_TYPES),
			bankIds: parseStringList(urlSearchParams.get('bankIds')),
			wordExtraMarks: parseEnumList(urlSearchParams.get('wordExtraMarks'), WORD_EXTRA_MARKS),
			bookmarkedOnly: urlSearchParams.get('bookmarkedOnly') === 'true'
		};
	}

	get hasActiveFilters(): boolean {
		return !filtersEqual(this.filters, WordsListFiltersState.DEFAULT_FILTERS);
	}

	buildSearchPayload(input: BuildSearchWordsParamsInput): SearchWordsParams {
		const trimmedSearch = this.filters.search.trim();

		return {
			language: input.language,
			page: 0,
			perPage: input.learningPerPage,
			sortBy: 'CREATED_AT',
			sortDirection: 'DESC',
			...(trimmedSearch ? { searchingPhrase: trimmedSearch } : {}),
			...(this.filters.wordTypes.length > 0 ? { wordTypes: this.filters.wordTypes } : {}),
			...(this.filters.wordExtraMarks.length > 0
				? { wordExtraMarks: this.filters.wordExtraMarks }
				: {}),
			...(this.filters.bankIds.length > 0 ? { banksIds: this.filters.bankIds } : {}),
			...(this.filters.bookmarkedOnly ? { bookmarked: true } : {})
		};
	}

	applyFromSearchParams(urlSearchParams: URLSearchParams) {
		const next = WordsListFiltersState.parseSearchParams(urlSearchParams);
		if (!filtersEqual(this.filters, next)) {
			this.filters = next;
		}
	}

	toQueryString(): string {
		return WordsListFiltersState.filtersToQueryString(this.filters);
	}

	static filtersToQueryString(filters: WordsListFilters): string {
		const params: string[] = [];

		if (filters.search) {
			params.push(`search=${encodeURIComponent(filters.search)}`);
		}
		if (filters.wordTypes.length > 0) {
			params.push(`wordTypes=${encodeURIComponent(filters.wordTypes.join(','))}`);
		}
		if (filters.bankIds.length > 0) {
			params.push(`bankIds=${encodeURIComponent(filters.bankIds.join(','))}`);
		}
		if (filters.wordExtraMarks.length > 0) {
			params.push(`wordExtraMarks=${encodeURIComponent(filters.wordExtraMarks.join(','))}`);
		}
		if (filters.bookmarkedOnly) {
			params.push('bookmarkedOnly=true');
		}

		return params.join('&');
	}

	matchesSearchParams(urlSearchParams: URLSearchParams): boolean {
		return filtersEqual(this.filters, WordsListFiltersState.parseSearchParams(urlSearchParams));
	}

	clearFilters() {
		this.filters = { ...WordsListFiltersState.DEFAULT_FILTERS };
	}
}
