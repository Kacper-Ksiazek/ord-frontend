import { api } from '../../axios';
import type {
	QAWFillGapsRequest,
	QAWFillGapsResponse
} from '$lib/types/quickly-added-word/api/fill-gaps';

/** Matches other long-running AI calls in the app. */
export const QAW_FILL_GAPS_TIMEOUT_MS = 180_000;

export async function fillQawGaps(body: QAWFillGapsRequest): Promise<QAWFillGapsResponse> {
	const response = await api.post<QAWFillGapsResponse>(
		'/api/v1/quickly-added-words/ai/fill-gaps',
		body,
		{ timeout: QAW_FILL_GAPS_TIMEOUT_MS }
	);

	return response.data;
}
