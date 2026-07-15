import type { UserDTO } from '$auth/types';
import { api } from '$lib/api-client/axios';

export async function httpGetCurrentUser(): Promise<UserDTO> {
	const response = await api.get<UserDTO>('/api/v1/users/me');

	return response.data;
}
