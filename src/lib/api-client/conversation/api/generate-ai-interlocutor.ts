import type { GenerateAiInterlocutorRequest } from '$lib/types/conversation/api/requests';
import type { GeneratedAIInterlocutorData } from '$lib/types/conversation/api/responses';
import { api } from '../../axios';

export async function generateAiInterlocutor(
	body: GenerateAiInterlocutorRequest
): Promise<GeneratedAIInterlocutorData> {
	const response = await api.post<GeneratedAIInterlocutorData>(
		'/api/v1/conversations/generate-ai-interlocutor',
		body
	);

	return response.data;
}
