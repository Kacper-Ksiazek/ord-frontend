import type { ApproveManyQAWRequest } from '$quicklyAddedWords/types';
import { api } from '$lib/api-client/axios';

export async function httpPatchApproveQAWMany(body: ApproveManyQAWRequest): Promise<void> {
	await api.patch('/api/v1/quickly-added-words/approve-many', body);
}
