import type { HomeResponse } from '$home/types';
import { api } from '$lib/api-client/axios';

export async function httpGetHome(): Promise<HomeResponse> {
	const response = await api.get<HomeResponse>('/api/v1/home');

	return response.data;
}
