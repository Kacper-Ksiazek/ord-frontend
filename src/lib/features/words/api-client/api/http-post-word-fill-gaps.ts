import type { WordFillGapsRequest, WordFillGapsResponse } from '$words/types';
import { api } from '$lib/api-client/axios';

export const WORD_FILL_GAPS_TIMEOUT_MS = 180_000;

export async function httpPostWordFillGaps(
	body: WordFillGapsRequest
): Promise<WordFillGapsResponse> {
	const response = await api.post<WordFillGapsResponse>('/api/v1/words/ai/fill-gaps', body, {
		timeout: WORD_FILL_GAPS_TIMEOUT_MS
	});

	return response.data;
}
