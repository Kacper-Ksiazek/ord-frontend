import type { QAWFillGapsRequest, QAWFillGapsResponse } from '$quicklyAddedWords/types';
import { api } from '$lib/api-client/axios';

/** Matches other long-running AI calls in the app. */
export const QAW_FILL_GAPS_TIMEOUT_MS = 180_000;

export async function httpPostFillQAWGaps(body: QAWFillGapsRequest): Promise<QAWFillGapsResponse> {
	const response = await api.post<QAWFillGapsResponse>(
		'/api/v1/quickly-added-words/ai/fill-gaps',
		body,
		{ timeout: QAW_FILL_GAPS_TIMEOUT_MS }
	);

	return response.data;
}
