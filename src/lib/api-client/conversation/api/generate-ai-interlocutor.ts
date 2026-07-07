import type { GenerateAiInterlocutorRequest } from '$conversations/types/api/requests';
import type { GeneratedAIInterlocutorData } from '$conversations/types/api/responses';
import { api } from '../../axios';

export async function generateAiInterlocutor(
	body: GenerateAiInterlocutorRequest
): Promise<GeneratedAIInterlocutorData> {
	const response = await api.post<GeneratedAIInterlocutorData>(
		'/api/v1/conversations/suggest-ai-interlocutor',
		body
	);

	return response.data;
}
