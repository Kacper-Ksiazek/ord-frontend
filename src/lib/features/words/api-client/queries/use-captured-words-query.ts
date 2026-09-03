import { createQuery } from '@tanstack/svelte-query';
import type { GetCapturedWordsParams, WordsPaginatedDataResponse } from '$words/types';
import { httpGetCapturedWords } from '../api/http-get-captured-words';
import { wordCaptureKeys } from '../keys';

export function createCapturedWordsQuery(
	getParams: () => GetCapturedWordsParams | null = () => null
) {
	return createQuery<WordsPaginatedDataResponse>(() => {
		const params = getParams();

		return {
			queryKey: params
				? wordCaptureKeys.list(params)
				: ([...wordCaptureKeys.lists(), 'disabled'] as const),
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
