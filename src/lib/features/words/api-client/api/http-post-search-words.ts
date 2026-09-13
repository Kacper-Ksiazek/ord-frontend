import type { SearchWordsParams, WordsPaginatedDataResponse } from '$words/types';
import { api } from '$lib/api-client/axios';
import { normalizeWordsPaginatedDataResponse } from '../utils/normalize-word-list-item';

export async function httpPostSearchWords(
	params: SearchWordsParams
): Promise<WordsPaginatedDataResponse> {
	const response = await api.post<WordsPaginatedDataResponse>('/api/v1/words/search', params);

	return normalizeWordsPaginatedDataResponse(response.data);
}
