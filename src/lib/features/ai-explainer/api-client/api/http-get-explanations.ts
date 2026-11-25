import type { SavedExplanation } from '$aiExplainer/types';
import { api } from '$lib/api-client/axios';

export async function httpGetExplanations(): Promise<SavedExplanation[]> {
	const response = await api.get<SavedExplanation[]>('/api/v1/ai-explainer/explanations');

	return response.data;
}
