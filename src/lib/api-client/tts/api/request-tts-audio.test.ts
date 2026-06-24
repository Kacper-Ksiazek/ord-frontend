import axios from 'axios';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { requestTtsAudio } from './request-tts-audio';

vi.mock('../../axios', () => ({
	api: {
		post: vi.fn()
	}
}));

import { api } from '../../axios';

describe('requestTtsAudio', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('positive path', () => {
		it('should return the audio blob from a successful response', async () => {
			const blob = new Blob(['audio'], { type: 'audio/mpeg' });
			vi.mocked(api.post).mockResolvedValue({ data: blob });

			const result = await requestTtsAudio('Hello');

			expect(api.post).toHaveBeenCalledWith(
				'/api/v1/tts/speak',
				{ text: 'Hello' },
				{ responseType: 'blob', signal: undefined }
			);
			expect(result).toBe(blob);
		});
	});

	describe('negative path', () => {
		it('should rethrow canceled requests without wrapping', async () => {
			const canceled = new axios.CanceledError('canceled');
			vi.mocked(api.post).mockRejectedValue(canceled);

			await expect(requestTtsAudio('Hello')).rejects.toBe(canceled);
		});

		it('should throw a user-facing message for 401 responses', async () => {
			vi.mocked(api.post).mockRejectedValue(
				new axios.AxiosError('Unauthorized', 'ERR_BAD_REQUEST', undefined, undefined, {
					status: 401,
					data: {},
					statusText: 'Unauthorized',
					headers: {},
					config: {} as never
				})
			);

			await expect(requestTtsAudio('Hello')).rejects.toThrow('Log in first, then try again.');
		});

		it('should parse error messages from blob error bodies', async () => {
			const errorBlob = new Blob([JSON.stringify({ error: 'TTS unavailable' })], {
				type: 'application/json'
			});

			vi.mocked(api.post).mockRejectedValue(
				new axios.AxiosError('Bad Request', 'ERR_BAD_REQUEST', undefined, undefined, {
					status: 400,
					data: errorBlob,
					statusText: 'Bad Request',
					headers: {},
					config: {} as never
				})
			);

			await expect(requestTtsAudio('Hello')).rejects.toThrow('TTS unavailable');
		});

		it('should throw a status-based fallback when the blob has no error field', async () => {
			const errorBlob = new Blob(['not-json'], { type: 'application/json' });

			vi.mocked(api.post).mockRejectedValue(
				new axios.AxiosError('Server Error', 'ERR_BAD_RESPONSE', undefined, undefined, {
					status: 500,
					data: errorBlob,
					statusText: 'Server Error',
					headers: {},
					config: {} as never
				})
			);

			await expect(requestTtsAudio('Hello')).rejects.toThrow('TTS failed (500)');
		});
	});

	describe('edge cases', () => {
		it('should pass through the abort signal', async () => {
			const blob = new Blob(['audio'], { type: 'audio/mpeg' });
			const controller = new AbortController();
			vi.mocked(api.post).mockResolvedValue({ data: blob });

			await requestTtsAudio('Hello', controller.signal);

			expect(api.post).toHaveBeenCalledWith(
				'/api/v1/tts/speak',
				{ text: 'Hello' },
				{ responseType: 'blob', signal: controller.signal }
			);
		});
	});
});
