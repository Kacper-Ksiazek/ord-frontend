import { createQuery } from '@tanstack/svelte-query';
import type { WordOverviewResponse } from '$quicklyAddedWords/types';
import { httpGetWordOverview } from '../api/http-get-qaw-overview';
import { qawKeys } from '../keys';

export function createQawOverviewQuery() {
	return createQuery<WordOverviewResponse>(() => ({
		queryKey: qawKeys.overview(),
		queryFn: httpGetWordOverview
	}));
}
