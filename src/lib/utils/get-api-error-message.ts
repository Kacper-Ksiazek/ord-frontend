import { isAxiosError } from 'axios';

export function getApiErrorMessage(error: unknown, fallback: string): string {
	if (!isAxiosError(error) || !error.response?.data) {
		return fallback;
	}

	const data = error.response.data;

	if (
		typeof data === 'object' &&
		data !== null &&
		'message' in data &&
		typeof data.message === 'string' &&
		data.message.length > 0
	) {
		return data.message;
	}

	return fallback;
}
