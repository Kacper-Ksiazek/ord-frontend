import { createQuery } from '@tanstack/svelte-query';
import type { GetWordsParams, WordsPaginatedDataResponse } from '$words/types';
import { httpGetWords } from '../api/http-get-words';
import { wordCaptureKeys } from '../keys';

export function createWordsQuery(getParams: () => GetWordsParams | null = () => null) {
	return createQuery<WordsPaginatedDataResponse>(() => {
		const params = getParams();

		return {
			queryKey: params
				? wordCaptureKeys.list(params)
				: ([...wordCaptureKeys.lists(), 'disabled'] as const),
			queryFn: () => {
				if (!params) {
					throw new Error('Words query requires language params');
				}

				return httpGetWords(params);
			},
			enabled: params !== null
		};
	});
}
