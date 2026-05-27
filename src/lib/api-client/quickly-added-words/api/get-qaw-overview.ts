import type { QAWOverviewResponse } from '$lib/types/quickly-added-word/api/overview';
import { api } from '../../axios';

export async function getQAWOverview(): Promise<QAWOverviewResponse> {
	const response = await api.get<QAWOverviewResponse>('/api/v1/quickly-added-words/overview');

	return response.data;
}
