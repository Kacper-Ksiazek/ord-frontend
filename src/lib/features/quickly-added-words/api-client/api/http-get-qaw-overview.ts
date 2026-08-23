import type { QAWOverviewResponse } from '$quicklyAddedWords/types';
import { api } from '$lib/api-client/axios';

export async function httpGetQAWOverview(): Promise<QAWOverviewResponse> {
	const response = await api.get<QAWOverviewResponse>('/api/v1/quickly-added-words/overview');

	return response.data;
}
