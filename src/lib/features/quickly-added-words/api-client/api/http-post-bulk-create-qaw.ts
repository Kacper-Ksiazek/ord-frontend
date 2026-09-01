import type { CreateQAWRequest } from '$quicklyAddedWords/types';
import { api } from '$lib/api-client/axios';

export async function httpPostBulkCreateQAW(body: CreateQAWRequest[]): Promise<void> {
	await api.post('/api/v1/quickly-added-words/bulk-create', body);
}
