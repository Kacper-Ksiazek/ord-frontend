import { createQuery } from '@tanstack/svelte-query';
import type { SingleWordResponse } from '$words/types';
import { httpGetWord } from '../api/http-get-word';
import { wordCaptureKeys } from '../keys';

export function createWordQuery(getWordId: () => string | null) {
	return createQuery<SingleWordResponse>(() => {
		const id = getWordId();

		return {
			queryKey: id
				? wordCaptureKeys.detail(id)
				: ([...wordCaptureKeys.all, 'detail', 'disabled'] as const),
			queryFn: () => {
				if (!id) {
					throw new Error('Word query requires an id');
				}

				return httpGetWord(id);
			},
			enabled: id !== null
		};
	});
}
