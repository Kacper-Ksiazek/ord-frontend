import { createQuery } from '@tanstack/svelte-query';
import type { GetWordOverviewParams, WordOverviewResponse } from '$words/types';
import { httpGetWordOverview } from '../api/http-get-word-overview';
import { wordCaptureKeys } from '../keys';

export function createWordOverviewQuery(
	getParams: () => GetWordOverviewParams | null = () => null
) {
	return createQuery<WordOverviewResponse>(() => {
		const params = getParams();

		return {
			queryKey: params
				? wordCaptureKeys.overview(params)
				: ([...wordCaptureKeys.all, 'overview', 'disabled'] as const),
			queryFn: () => {
				if (!params) {
					throw new Error('Word overview query called without language params');
				}

				return httpGetWordOverview(params);
			},
			enabled: params !== null
		};
	});
}
