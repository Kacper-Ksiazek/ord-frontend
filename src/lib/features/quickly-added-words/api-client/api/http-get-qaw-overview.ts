import type { WordOverviewResponse } from '$quicklyAddedWords/types';
import { api } from '$lib/api-client/axios';

export async function httpGetWordOverview(): Promise<WordOverviewResponse> {
	const response = await api.get<WordOverviewResponse>('/api/v1/words/overview');

	return response.data;
}
