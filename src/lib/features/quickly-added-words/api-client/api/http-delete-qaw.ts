import { api } from '$lib/api-client/axios';

export async function httpDeleteWord(id: string): Promise<void> {
	await api.delete(`/api/v1/words/${id}`);
}
