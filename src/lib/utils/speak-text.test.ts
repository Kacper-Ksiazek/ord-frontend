import axios from 'axios';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { requestTtsAudio } from '$lib/utils/tts/request-tts-audio';
import { speakTextPlayback } from './speak-text.svelte';
import { SpeakTextCanceledError, speakText, stopSpeaking } from './speak-text';

vi.mock('$lib/utils/tts/request-tts-audio', () => ({
	requestTtsAudio: vi.fn()
}));

type MockAudioListeners = Partial<Record<string, Set<() => void>>>;

class MockAudioElement {
	src = '';
	currentTime = 0;
	duration = 5;
	readyState = 0;
	paused = true;
	private listeners: MockAudioListeners = {};

	addEventListener(event: string, listener: () => void) {
		(this.listeners[event] ??= new Set()).add(listener);
	}

	removeEventListener(event: string, listener: () => void) {
		this.listeners[event]?.delete(listener);
	}

	play() {
		this.paused = false;
		queueMicrotask(() => this.dispatch('playing'));

		return Promise.resolve();
	}

	pause() {
		this.paused = true;
	}

	emit(event: string) {
		for (const listener of this.listeners[event] ?? []) {
			listener();
		}
	}

	private dispatch(event: string) {
		this.emit(event);
	}
}

let mockAudio: MockAudioElement;

const HAVE_METADATA = 1;

function mockResolvedTtsAudio() {
	vi.mocked(requestTtsAudio).mockImplementation(async (_text, signal) => {
		if (signal?.aborted) {
			throw new axios.CanceledError('canceled');
		}

		return new Blob(['audio'], { type: 'audio/mpeg' });
	});
}

function resetPlaybackStore() {
	speakTextPlayback.id = null;
	speakTextPlayback.status = 'idle';
	speakTextPlayback.progress = { currentTime: 0, duration: 0 };
}

describe('speakText', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		stopSpeaking();
		resetPlaybackStore();
		mockAudio = new MockAudioElement();

		vi.stubGlobal('HTMLMediaElement', { HAVE_METADATA });

		vi.stubGlobal(
			'Audio',
			vi.fn(() => mockAudio)
		);

		vi.stubGlobal('URL', {
			createObjectURL: vi.fn(() => 'blob:mock-audio'),
			revokeObjectURL: vi.fn()
		});

		vi.mocked(requestTtsAudio).mockReset();
		mockResolvedTtsAudio();
	});

	afterEach(() => {
		stopSpeaking();
		resetPlaybackStore();
		vi.unstubAllGlobals();
	});

	describe('positive path', () => {
		it('should resolve with duration after playback ends', async () => {
			const playback = speakText('Hello', { id: 1 });

			await Promise.resolve();
			mockAudio.readyState = HAVE_METADATA;
			mockAudio.emit('loadedmetadata');
			await Promise.resolve();
			mockAudio.emit('ended');

			await expect(playback).resolves.toEqual({ duration: 5 });
		});
	});

	describe('negative path', () => {
		it('should settle a prior call when superseded by a newer speakText', async () => {
			let unblockFetch = () => {};
			const blockedFetch = new Promise<Blob>((resolve) => {
				unblockFetch = () => resolve(new Blob(['audio'], { type: 'audio/mpeg' }));
			});

			vi.mocked(requestTtsAudio).mockImplementationOnce(() => blockedFetch);

			const first = speakText('First message', { id: 1 });

			await Promise.resolve();
			unblockFetch();
			await Promise.resolve();

			void speakText('Second message', { id: 2 });

			await expect(
				Promise.race([
					first,
					new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 200))
				])
			).resolves.toBeUndefined();
		});

		it('should settle when stopSpeaking is called during metadata wait', async () => {
			const playback = speakText('Hello', { id: 1 });
			const settled = Promise.race([
				playback.then((value) => ({ kind: 'resolved' as const, value })),
				playback.catch((error) => ({ kind: 'rejected' as const, error })),
				new Promise<{ kind: 'timeout' }>((resolve) =>
					setTimeout(() => resolve({ kind: 'timeout' }), 200)
				)
			]);

			await Promise.resolve();
			stopSpeaking();

			const outcome = (await settled) as
				| { kind: 'resolved'; value: Awaited<typeof playback> }
				| { kind: 'rejected'; error: unknown }
				| { kind: 'timeout' };

			expect(outcome.kind).not.toBe('timeout');
		});
	});

	describe('edge cases', () => {
		it('should expose SpeakTextCanceledError for superseded playback handlers', () => {
			expect(new SpeakTextCanceledError()).toBeInstanceOf(Error);
			expect(new SpeakTextCanceledError().name).toBe('SpeakTextCanceledError');
		});
	});
});
