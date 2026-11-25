import type {
	ExplainPhraseSuggestActionsRequest,
	ExplainPhraseSuggestActionsResponse
} from '$aiExplainer/types';
import { api } from '$lib/api-client/axios';

export async function httpPostSuggestActions(
	body: ExplainPhraseSuggestActionsRequest,
	signal?: AbortSignal
): Promise<ExplainPhraseSuggestActionsResponse> {
	const response = await api.post<ExplainPhraseSuggestActionsResponse>(
		'/api/v1/ai-explainer/explain-phrase/suggest-actions',
		body,
		{ signal }
	);

	return response.data;
}
