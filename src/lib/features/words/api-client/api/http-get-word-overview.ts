import type { GetWordOverviewParams, WordOverviewResponse } from '$words/types';
import { api } from '$lib/api-client/axios';

export async function httpGetWordOverview(
	params: GetWordOverviewParams
): Promise<WordOverviewResponse> {
	const response = await api.get<WordOverviewResponse>('/api/v1/words/overview', {
		params: {
			language: params.language
		}
	});

	return response.data;
}
