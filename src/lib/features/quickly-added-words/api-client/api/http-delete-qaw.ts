import { api } from '$lib/api-client/axios';

export async function httpDeleteQAW(id: string): Promise<void> {
	await api.delete(`/api/v1/quickly-added-words/${id}`);
}
