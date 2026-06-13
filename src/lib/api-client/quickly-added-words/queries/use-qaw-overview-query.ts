import { createQuery } from '@tanstack/svelte-query';
import type { QAWOverviewResponse } from '$lib/types/quickly-added-word/api/overview';
import { getQAWOverview } from '../api/get-qaw-overview';
import { qawKeys } from '../keys';

export function createQAWOverviewQuery() {
	return createQuery<QAWOverviewResponse>(() => ({
		queryKey: qawKeys.overview(),
		queryFn: getQAWOverview
	}));
}
