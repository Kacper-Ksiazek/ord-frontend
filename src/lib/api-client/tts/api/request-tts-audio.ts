import axios from 'axios';
import { api } from '../../axios';

async function errorMessageFromBlob(blob: Blob): Promise<string | null> {
	try {
		const body = JSON.parse(await blob.text()) as { error?: unknown };

		return typeof body.error === 'string' ? body.error : null;
	} catch {
		return null;
	}
}

export async function requestTtsAudio(text: string, signal?: AbortSignal): Promise<Blob> {
	try {
		const response = await api.post<Blob>(
			'/api/v1/tts/speak',
			{ text },
			{ responseType: 'blob', signal }
		);

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.code === 'ERR_CANCELED') {
			throw error;
		}

		if (axios.isAxiosError(error) && error.response) {
			const { status, data } = error.response;

			if (data instanceof Blob) {
				const apiError = await errorMessageFromBlob(data);

				if (apiError) {
					throw new Error(apiError);
				}
			}

			if (status === 401) {
				throw new Error('Log in first, then try again.');
			}

			throw new Error(`TTS failed (${status})`);
		}

		throw error instanceof Error ? error : new Error('Request failed');
	}
}
