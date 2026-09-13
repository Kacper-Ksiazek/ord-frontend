import { createQuery } from '@tanstack/svelte-query';
import type { SingleWordResponse } from '$words/types';
import { httpGetWord } from '../api/http-get-word';
import { wordCaptureKeys } from '../keys';

export function createWordQuery(
	getWordId: () => string | null,
	getPlaceholder: () => SingleWordResponse | undefined = () => undefined
) {
	return createQuery<SingleWordResponse>(() => {
		const id = getWordId();
		const placeholder = getPlaceholder();

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
			enabled: Boolean(id),
			placeholderData: placeholder?.id && placeholder.id === id ? placeholder : undefined,
			refetchOnMount: 'always'
		};
	});
}
