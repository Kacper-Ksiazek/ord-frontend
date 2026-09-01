import { createQuery } from '@tanstack/svelte-query';
import type { GetCapturedWordsParams, WordsPaginatedDataResponse } from '$quicklyAddedWords/types';
import { httpGetCapturedWords } from '../api/http-get-quickly-added-words';
import { qawKeys } from '../keys';

export function createQuicklyAddedWordsQuery(
	getParams: () => GetCapturedWordsParams | null = () => null
) {
	return createQuery<WordsPaginatedDataResponse>(() => {
		const params = getParams();

		return {
			queryKey: params ? qawKeys.list(params) : ([...qawKeys.lists(), 'disabled'] as const),
			queryFn: () => {
				if (!params) {
					throw new Error('Captured words query requires language params');
				}

				return httpGetCapturedWords(params);
			},
			enabled: params !== null
		};
	});
}
