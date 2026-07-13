import { api } from '$lib/api-client/axios';

export async function httpDeleteLogout(): Promise<void> {
	await api.delete('/api/v1/auth/logout');
}
