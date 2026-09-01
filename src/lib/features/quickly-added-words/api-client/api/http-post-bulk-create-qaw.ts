import type { CaptureWordRequest } from '$quicklyAddedWords/types';
import { api } from '$lib/api-client/axios';

export async function httpPostCaptureWords(body: CaptureWordRequest[]): Promise<void> {
	await api.post('/api/v1/words/capture', body);
}
