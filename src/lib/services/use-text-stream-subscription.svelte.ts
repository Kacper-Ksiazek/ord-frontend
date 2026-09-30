import { onDestroy } from 'svelte';
import type { Observable, Subscription } from 'rxjs';

export type TextStreamHandlers = {
	onChunk: (chunk: string) => void;
	onError?: () => void;
	onComplete?: () => void;
};

/** Reusable RxJS `Observable<string>` subscription with Svelte teardown. */
export function useTextStreamSubscription() {
	let subscription: Subscription | undefined;
	let isStreaming = $state(false);

	onDestroy(() => {
		stop();
	});

	function stop() {
		subscription?.unsubscribe();
		subscription = undefined;
	}

	function start(source: Observable<string>, handlers: TextStreamHandlers) {
		stop();
		isStreaming = true;

		subscription = source.subscribe({
			next: handlers.onChunk,
			error: () => {
				isStreaming = false;
				handlers.onError?.();
			},
			complete: () => {
				isStreaming = false;
				handlers.onComplete?.();
			}
		});
	}

	return {
		get isStreaming() {
			return isStreaming;
		},
		start,
		stop
	};
}
