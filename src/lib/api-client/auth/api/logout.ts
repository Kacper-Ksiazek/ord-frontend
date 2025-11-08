import { api } from '../../axios';

export async function logout(): Promise<void> {
	await api.delete('/api/v1/auth/logout');
}
