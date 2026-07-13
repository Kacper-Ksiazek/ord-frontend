import type { GenerateAiInterlocutorRequest } from '$conversations/types';
import type { GeneratedAIInterlocutorData } from '$conversations/types';
import { api } from '$lib/api-client/axios';

export async function httpGenerateAiInterlocutor(
	body: GenerateAiInterlocutorRequest
): Promise<GeneratedAIInterlocutorData> {
	const response = await api.post<GeneratedAIInterlocutorData>(
		'/api/v1/conversations/suggest-ai-interlocutor',
		body
	);

	return response.data;
}
