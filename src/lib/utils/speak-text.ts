import axios from 'axios';
import { requestTtsAudio } from '$lib/api-client/tts/api/request-tts-audio';
import { speakTextPlayback } from './speak-text.svelte';
import type { SpeakTextProgress, SpeakTextStatus } from './speak-text.types';

export type { SpeakTextProgress, SpeakTextStatus } from './speak-text.types';

export type SpeakTextResult = {
	duration: number;
};

export type SpeakTextOptions = {
	signal?: AbortSignal;
	id?: string | number;
	onProgress?: (progress: SpeakTextProgress) => void;
};

let audio: HTMLAudioElement | null = null;
let objectUrl: string | null = null;
let abortController: AbortController | null = null;
let requestId = 0;

function resetPlaybackState() {
	speakTextPlayback.id = null;
	speakTextPlayback.status = 'idle';
	speakTextPlayback.progress = { currentTime: 0, duration: 0 };
}

function setPlaybackState(
	id: string | number | null,
	status: SpeakTextStatus,
	progress: SpeakTextProgress = { currentTime: 0, duration: 0 }
) {
	speakTextPlayback.id = id;
	speakTextPlayback.status = status;
	speakTextPlayback.progress = progress;
}

function emitProgress(
	id: string | number | null,
	progress: SpeakTextProgress,
	onProgress?: (progress: SpeakTextProgress) => void
) {
	if (id !== null) {
		speakTextPlayback.progress = progress;
	}

	onProgress?.(progress);
}

function revokeObjectUrl() {
	if (objectUrl) {
		URL.revokeObjectURL(objectUrl);
		objectUrl = null;
	}
}

function resetAudio() {
	audio?.pause();

	if (audio) {
		audio.src = '';
	}

	revokeObjectUrl();
}

export function stopSpeaking(): void {
	++requestId;
	abortController?.abort();
	resetAudio();
	resetPlaybackState();
}

function waitForMetadata(element: HTMLAudioElement, id: number): Promise<number> {
	return new Promise((resolve, reject) => {
		const cleanup = () => {
			element.removeEventListener('loadedmetadata', onLoadedMetadata);
			element.removeEventListener('error', onError);
		};

		const onLoadedMetadata = () => {
			cleanup();

			if (id !== requestId) {
				return;
			}

			const duration = element.duration;

			if (!Number.isFinite(duration)) {
				reject(new Error('Could not determine audio duration'));

				return;
			}

			resolve(duration);
		};

		const onError = () => {
			cleanup();

			if (id !== requestId) {
				return;
			}

			reject(new Error('Playback failed'));
		};

		if (element.readyState >= HTMLMediaElement.HAVE_METADATA) {
			const duration = element.duration;

			if (!Number.isFinite(duration)) {
				reject(new Error('Could not determine audio duration'));

				return;
			}

			resolve(duration);

			return;
		}

		element.addEventListener('loadedmetadata', onLoadedMetadata);
		element.addEventListener('error', onError);
	});
}

function waitForPlayback(
	element: HTMLAudioElement,
	id: number,
	duration: number,
	speakingId: string | number | null,
	onProgress?: (progress: SpeakTextProgress) => void
): Promise<void> {
	return new Promise((resolve, reject) => {
		const cleanupListeners = () => {
			element.removeEventListener('ended', onEnded);
			element.removeEventListener('error', onError);
			element.removeEventListener('timeupdate', onTimeUpdate);
			element.removeEventListener('playing', onPlaying);
		};

		const onTimeUpdate = () => {
			if (id !== requestId) {
				return;
			}

			emitProgress(speakingId, { currentTime: element.currentTime, duration }, onProgress);
		};

		const onPlaying = () => {
			if (id !== requestId) {
				return;
			}

			if (speakingId !== null) {
				speakTextPlayback.status = 'playing';
			}
		};

		const onEnded = () => {
			cleanupListeners();

			if (id !== requestId) {
				return;
			}

			emitProgress(speakingId, { currentTime: duration, duration }, onProgress);
			revokeObjectUrl();
			resolve();
		};

		const onError = () => {
			cleanupListeners();

			if (id !== requestId) {
				return;
			}

			revokeObjectUrl();
			reject(new Error('Playback failed'));
		};

		emitProgress(speakingId, { currentTime: 0, duration }, onProgress);

		element.addEventListener('ended', onEnded);
		element.addEventListener('error', onError);
		element.addEventListener('timeupdate', onTimeUpdate);
		element.addEventListener('playing', onPlaying);
		element.play().catch((error) => {
			cleanupListeners();

			if (id !== requestId) {
				return;
			}

			revokeObjectUrl();
			reject(error instanceof Error ? error : new Error('Playback failed'));
		});
	});
}

/** Fetches TTS audio for `text` and plays it. Resolves when playback ends. */
export async function speakText(
	text: string,
	options?: SpeakTextOptions
): Promise<SpeakTextResult | undefined> {
	stopSpeaking();

	const controller = new AbortController();
	abortController = controller;
	const id = ++requestId;
	const speakingId = options?.id ?? null;

	if (options?.signal) {
		if (options.signal.aborted) {
			return;
		}

		options.signal.addEventListener('abort', () => controller.abort(), { once: true });
	}

	setPlaybackState(speakingId, 'loading');

	try {
		const blob = await requestTtsAudio(text, controller.signal);

		if (id !== requestId || controller.signal.aborted) {
			return;
		}

		if (!audio) {
			audio = new Audio();
		}

		resetAudio();

		const url = URL.createObjectURL(blob);
		objectUrl = url;
		audio.src = url;

		const duration = await waitForMetadata(audio, id);

		if (id !== requestId || controller.signal.aborted) {
			return;
		}

		await waitForPlayback(audio, id, duration, speakingId, options?.onProgress);

		if (id !== requestId || controller.signal.aborted) {
			return;
		}

		resetPlaybackState();

		return { duration };
	} catch (error) {
		if (
			controller.signal.aborted ||
			(axios.isAxiosError(error) && error.code === 'ERR_CANCELED') ||
			id !== requestId
		) {
			return;
		}

		resetAudio();
		resetPlaybackState();
		throw error instanceof Error ? error : new Error('Request failed');
	}
}
