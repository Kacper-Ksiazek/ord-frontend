import { api } from '$lib/api-client/axios';

export async function httpDeleteExplanation(explanationId: string): Promise<void> {
	await api.delete(`/api/v1/ai-explainer/explanations/${explanationId}`);
}
