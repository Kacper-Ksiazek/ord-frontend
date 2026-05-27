import type { ApproveManyQAWRequest } from '$lib/types/quickly-added-word/api/requests';
import { api } from '../../axios';

export async function approveQawMany(body: ApproveManyQAWRequest): Promise<void> {
	await api.patch('/api/v1/quickly-added-words/approve-many', body);
}
