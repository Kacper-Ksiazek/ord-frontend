import type { BulkDeleteQAWRequest } from '$quicklyAddedWords/types';
import { api } from '$lib/api-client/axios';

export async function httpPostBulkDeleteQAW(ids: BulkDeleteQAWRequest): Promise<void> {
	await api.post('/api/v1/quickly-added-words/bulk-delete', ids);
}
