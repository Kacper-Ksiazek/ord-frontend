import type { UserDTO } from '$lib/types/auth';
import { api } from '../../axios';

export async function getCurrentUser(): Promise<UserDTO> {
	const response = await api.get<UserDTO>('/api/v1/users/me');

	return response.data;
}
