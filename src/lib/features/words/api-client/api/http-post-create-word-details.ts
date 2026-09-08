import type { components } from '@kacper-ksiazek/ord-api-types';
import { api } from '$lib/api-client/axios';

export type CreateWordDetailsRequest = components['schemas']['CreateWordDetailsRequest'];
export type WordDetailsCompact = components['schemas']['WordDetailsCompactDTO'];

export async function httpPostCreateWordDetails(
	wordId: string,
	body: CreateWordDetailsRequest
): Promise<WordDetailsCompact> {
	const response = await api.post<WordDetailsCompact>(`/api/v1/words/${wordId}/details`, body);

	return response.data;
}
