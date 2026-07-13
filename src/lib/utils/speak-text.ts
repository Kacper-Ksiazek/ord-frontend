import axios from 'axios';
import { httpRequestTtsAudio } from '$lib/api-client/api/http-request-tts-audio';
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

export class SpeakTextCanceledError extends Error {
	constructor() {
		super('Playback canceled');
		this.name = 'SpeakTextCanceledError';
	}
}

let audio: HTMLAudioElement | null = null;
let objectUrl: string | null = null;
let abortController: AbortController | null = null;
let requestId = 0;
const pendingCancellations = new Set<() => void>();

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

	for (const cancel of pendingCancellations) {
		cancel();
	}

	pendingCancellations.clear();
	abortController?.abort();
	resetAudio();
	resetPlaybackState();
}

function rejectIfSuperseded(id: number, reject: (error: Error) => void): boolean {
	if (id !== requestId) {
		reject(new SpeakTextCanceledError());

		return true;
	}

	return false;
}

function trackPendingCancellation(id: number, reject: (error: Error) => void, cleanup: () => void) {
	const cancel = () => {
		cleanup();
		pendingCancellations.delete(cancel);

		if (id !== requestId) {
			reject(new SpeakTextCanceledError());
		}
	};

	pendingCancellations.add(cancel);

	const disarm = () => {
		cleanup();
		pendingCancellations.delete(cancel);
	};

	return { cancel, disarm };
}

function waitForMetadata(element: HTMLAudioElement, id: number): Promise<number> {
	return new Promise((resolve, reject) => {
		function onLoadedMetadata() {
			settle(() => {
				if (rejectIfSuperseded(id, reject)) {
					return;
				}

				const duration = element.duration;

				if (!Number.isFinite(duration)) {
					reject(new Error('Could not determine audio duration'));

					return;
				}

				resolve(duration);
			});
		}

		function onError() {
			settle(() => {
				if (rejectIfSuperseded(id, reject)) {
					return;
				}

				reject(new Error('Playback failed'));
			});
		}

		const { disarm: disarmPending } = trackPendingCancellation(id, reject, () => {
			element.removeEventListener('loadedmetadata', onLoadedMetadata);
			element.removeEventListener('error', onError);
		});

		const settle = (handler: () => void) => {
			disarmPending();
			handler();
		};

		if (element.readyState >= HTMLMediaElement.HAVE_METADATA) {
			if (rejectIfSuperseded(id, reject)) {
				disarmPending();

				return;
			}

			const duration = element.duration;

			if (!Number.isFinite(duration)) {
				disarmPending();
				reject(new Error('Could not determine audio duration'));

				return;
			}

			disarmPending();
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
		function onTimeUpdate() {
			if (id !== requestId) {
				return;
			}

			emitProgress(speakingId, { currentTime: element.currentTime, duration }, onProgress);
		}

		function onPlaying() {
			if (id !== requestId) {
				return;
			}

			if (speakingId !== null) {
				speakTextPlayback.status = 'playing';
			}
		}

		function onEnded() {
			settle(() => {
				if (rejectIfSuperseded(id, reject)) {
					return;
				}

				emitProgress(speakingId, { currentTime: duration, duration }, onProgress);
				revokeObjectUrl();
				resolve();
			});
		}

		function onError() {
			settle(() => {
				if (rejectIfSuperseded(id, reject)) {
					return;
				}

				revokeObjectUrl();
				reject(new Error('Playback failed'));
			});
		}

		const { disarm: disarmPending } = trackPendingCancellation(id, reject, () => {
			element.removeEventListener('ended', onEnded);
			element.removeEventListener('error', onError);
			element.removeEventListener('timeupdate', onTimeUpdate);
			element.removeEventListener('playing', onPlaying);
		});

		const settle = (handler: () => void) => {
			disarmPending();
			handler();
		};

		emitProgress(speakingId, { currentTime: 0, duration }, onProgress);

		element.addEventListener('ended', onEnded);
		element.addEventListener('error', onError);
		element.addEventListener('timeupdate', onTimeUpdate);
		element.addEventListener('playing', onPlaying);
		element.play().catch((error) => {
			settle(() => {
				if (rejectIfSuperseded(id, reject)) {
					return;
				}

				revokeObjectUrl();
				reject(error instanceof Error ? error : new Error('Playback failed'));
			});
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
		const blob = await httpRequestTtsAudio(text, controller.signal);

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
			error instanceof SpeakTextCanceledError ||
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
