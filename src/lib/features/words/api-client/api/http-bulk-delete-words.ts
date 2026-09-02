import { httpDeleteWord } from './http-delete-word';

export async function httpBulkDeleteWords(ids: string[]): Promise<void> {
	await Promise.all(ids.map((id) => httpDeleteWord(id)));
}
