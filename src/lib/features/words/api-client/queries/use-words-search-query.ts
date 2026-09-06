import { createQuery } from '@tanstack/svelte-query';
import type { SearchWordsParams, WordsPaginatedDataResponse } from '$words/types';
import { httpPostSearchWords } from '../api/http-post-search-words';
import { wordCaptureKeys } from '../keys';

const searchParamsKey = (params: SearchWordsParams) =>
	({
		language: params.language,
		page: params.page ?? 0,
		perPage: params.perPage ?? 50,
		hasProgress: params.hasProgress ?? true,
		searchingPhrase: params.searchingPhrase ?? null,
		wordTypes: params.wordTypes ?? [],
		wordExtraMarks: params.wordExtraMarks ?? [],
		banksIds: params.banksIds ?? [],
		sortBy: params.sortBy ?? 'CREATED_AT',
		sortDirection: params.sortDirection ?? 'DESC'
	}) as const;

export function createWordsSearchQuery(getParams: () => SearchWordsParams | null = () => null) {
	return createQuery<WordsPaginatedDataResponse>(() => {
		const params = getParams();

		return {
			queryKey: params
				? wordCaptureKeys.search(searchParamsKey(params))
				: ([...wordCaptureKeys.searches(), 'disabled'] as const),
			queryFn: () => {
				if (!params) {
					throw new Error('Words search query requires params');
				}

				return httpPostSearchWords(params);
			},
			enabled: params !== null
		};
	});
}
