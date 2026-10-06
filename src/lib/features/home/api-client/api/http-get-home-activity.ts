import type { HomeActivityPerDay } from '$home/types';
import { api } from '$lib/api-client/axios';

export async function httpGetHomeActivity(): Promise<HomeActivityPerDay> {
	const response = await api.get<HomeActivityPerDay>('/api/v1/home/activity');

	return response.data;
}
