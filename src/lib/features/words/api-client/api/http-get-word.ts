import type { SingleWordResponse } from '$words/types';
import { api } from '$lib/api-client/axios';

export async function httpGetWord(id: string): Promise<SingleWordResponse> {
	const response = await api.get<SingleWordResponse>(`/api/v1/words/${id}`);

	return response.data;
}
