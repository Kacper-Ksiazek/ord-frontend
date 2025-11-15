import type { UserDTO } from '$lib/features/auth/types';
import { api } from '../../axios';

export async function getCurrentUser(): Promise<UserDTO> {
	const response = await api.get<UserDTO>('/api/v1/users/me');

	return response.data;
}
