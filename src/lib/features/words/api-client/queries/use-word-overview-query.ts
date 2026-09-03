import { createQuery } from '@tanstack/svelte-query';
import type { WordOverviewResponse } from '$words/types';
import { httpGetWordOverview } from '../api/http-get-word-overview';
import { wordCaptureKeys } from '../keys';

export function createWordOverviewQuery() {
	return createQuery<WordOverviewResponse>(() => ({
		queryKey: wordCaptureKeys.overview(),
		queryFn: httpGetWordOverview
	}));
}
