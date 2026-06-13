import type { BulkDeleteQAWRequest } from '$lib/types/quickly-added-word/api/requests';
import { api } from '../../axios';

export async function deleteQawMany(ids: BulkDeleteQAWRequest): Promise<void> {
	await api.post('/api/v1/quickly-added-words/bulk-delete', ids);
}
