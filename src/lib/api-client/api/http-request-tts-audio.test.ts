import axios from 'axios';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { httpRequestTtsAudio } from '$lib/api-client/api/http-request-tts-audio';

vi.mock('$lib/api-client/axios', () => ({
	api: {
		post: vi.fn()
	}
}));

vi.mock('axios', () => ({
	default: {
		isAxiosError: vi.fn()
	}
}));

describe('httpRequestTtsAudio', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('returns blob on success', async () => {
		const blob = new Blob(['audio'], { type: 'audio/mpeg' });
		const { api } = await import('$lib/api-client/axios');
		vi.mocked(api.post).mockResolvedValue({ data: blob });

		const result = await httpRequestTtsAudio('Hello');

		expect(result).toBe(blob);
		expect(api.post).toHaveBeenCalledWith(
			'/api/v1/tts/speak',
			{ text: 'Hello' },
			{ responseType: 'blob', signal: undefined }
		);
	});

	it('rethrows canceled axios errors', async () => {
		const canceled = new Error('canceled');
		const { api } = await import('$lib/api-client/axios');
		vi.mocked(api.post).mockRejectedValue(canceled);
		vi.mocked(axios.isAxiosError).mockReturnValue(true);
		Object.assign(canceled, { code: 'ERR_CANCELED' });

		await expect(httpRequestTtsAudio('Hello')).rejects.toBe(canceled);
	});

	it('throws login message on 401', async () => {
		const { api } = await import('$lib/api-client/axios');
		vi.mocked(api.post).mockRejectedValue({
			response: { status: 401, data: {} }
		});
		vi.mocked(axios.isAxiosError).mockReturnValue(true);

		await expect(httpRequestTtsAudio('Hello')).rejects.toThrow('Log in first, then try again.');
	});

	it('throws API error message from blob response', async () => {
		const errorBlob = new Blob([JSON.stringify({ error: 'TTS unavailable' })], {
			type: 'application/json'
		});
		const { api } = await import('$lib/api-client/axios');
		vi.mocked(api.post).mockRejectedValue({
			response: { status: 400, data: errorBlob }
		});
		vi.mocked(axios.isAxiosError).mockReturnValue(true);

		await expect(httpRequestTtsAudio('Hello')).rejects.toThrow('TTS unavailable');
	});

	it('throws status fallback when blob has no error message', async () => {
		const errorBlob = new Blob(['not-json'], { type: 'application/json' });
		const { api } = await import('$lib/api-client/axios');
		vi.mocked(api.post).mockRejectedValue({
			response: { status: 500, data: errorBlob }
		});
		vi.mocked(axios.isAxiosError).mockReturnValue(true);

		await expect(httpRequestTtsAudio('Hello')).rejects.toThrow('TTS failed (500)');
	});

	it('passes abort signal to axios', async () => {
		const blob = new Blob(['audio'], { type: 'audio/mpeg' });
		const { api } = await import('$lib/api-client/axios');
		vi.mocked(api.post).mockResolvedValue({ data: blob });
		const controller = new AbortController();

		await httpRequestTtsAudio('Hello', controller.signal);

		expect(api.post).toHaveBeenCalledWith(
			'/api/v1/tts/speak',
			{ text: 'Hello' },
			{ responseType: 'blob', signal: controller.signal }
		);
	});
});
