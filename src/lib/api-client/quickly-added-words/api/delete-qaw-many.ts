import { api } from '../../axios';

export async function deleteQawMany(ids: string[]): Promise<void> {
	await api.post('/api/v1/quickly-added-words/bulk-delete', ids);
}
