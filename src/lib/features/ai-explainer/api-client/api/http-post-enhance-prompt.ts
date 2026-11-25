import type { ExplainPhraseEnhanceRequest, ExplainPhraseEnhanceResponse } from '$aiExplainer/types';
import { api } from '$lib/api-client/axios';

export async function httpPostEnhancePrompt(
	body: ExplainPhraseEnhanceRequest,
	signal?: AbortSignal
): Promise<ExplainPhraseEnhanceResponse> {
	const response = await api.post<ExplainPhraseEnhanceResponse>(
		'/api/v1/ai-explainer/explain-phrase/enhance',
		body,
		{ signal }
	);

	return response.data;
}
