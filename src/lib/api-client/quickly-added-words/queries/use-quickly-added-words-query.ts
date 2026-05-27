import { createQuery } from '@tanstack/svelte-query';
import type { GetQuicklyAddedWordsParams } from '$lib/types/quickly-added-word/api/list-quickly-added-words';
import type { PaginatedQuicklyAddedWordsResponse } from '$lib/types/quickly-added-word/api/responses';
import { getQuicklyAddedWords } from '../api/get-quickly-added-words';
import { qawKeys } from '../keys';

export function createQuicklyAddedWordsQuery(
	getParams: () => GetQuicklyAddedWordsParams = () => ({})
) {
	return createQuery<PaginatedQuicklyAddedWordsResponse>(() => {
		const params = getParams();

		return {
			queryKey: qawKeys.list(params),
			queryFn: () => getQuicklyAddedWords(params)
		};
	});
}
