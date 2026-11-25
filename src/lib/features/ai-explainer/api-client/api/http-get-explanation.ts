import type { SavedExplanation } from '$aiExplainer/types';
import { api } from '$lib/api-client/axios';

export async function httpGetExplanation(explanationId: string): Promise<SavedExplanation> {
	const response = await api.get<SavedExplanation>(
		`/api/v1/ai-explainer/explanations/${explanationId}`
	);

	return response.data;
}
