import { api } from '../../axios';

export async function deleteQaw(id: string): Promise<void> {
	await api.delete(`/api/v1/quickly-added-words/${id}`);
}
