import type { components } from '@kacper-ksiazek/ord-api-types';
import { api } from '$lib/api-client/axios';

export type GenerateWordManualRequest = components['schemas']['GenerateWordManualRequest'];
export type AIGeneratedWordManual = components['schemas']['AIGeneratedWordManual'];

export async function httpPostGenerateWordManual(
	body: GenerateWordManualRequest
): Promise<AIGeneratedWordManual> {
	const response = await api.post<AIGeneratedWordManual>('/api/v1/words/ai/generate-manual', body);

	return response.data;
}
