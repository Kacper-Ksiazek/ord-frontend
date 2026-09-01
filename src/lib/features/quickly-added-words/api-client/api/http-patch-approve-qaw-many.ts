import type { ActivateManyWordsRequest } from '$quicklyAddedWords/types';
import { api } from '$lib/api-client/axios';

export async function httpPatchActivateManyWords(body: ActivateManyWordsRequest): Promise<void> {
	await api.patch('/api/v1/words/activate-many', body);
}
