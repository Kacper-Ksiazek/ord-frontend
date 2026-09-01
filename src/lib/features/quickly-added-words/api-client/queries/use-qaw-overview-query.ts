import { createQuery } from '@tanstack/svelte-query';
import type { QAWOverviewResponse } from '$quicklyAddedWords/types';
import { httpGetQAWOverview } from '../api/http-get-qaw-overview';
import { qawKeys } from '../keys';

export function createQawOverviewQuery() {
	return createQuery<QAWOverviewResponse>(() => ({
		queryKey: qawKeys.overview(),
		queryFn: httpGetQAWOverview
	}));
}
