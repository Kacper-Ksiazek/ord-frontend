import type { BulkCreateQAWRequest } from '$lib/types/quickly-added-word/api/requests';
import { api } from '../../axios';

export async function bulkCreateQaw(body: BulkCreateQAWRequest): Promise<void> {
	await api.post('/api/v1/quickly-added-words/bulk-create', body);
}
