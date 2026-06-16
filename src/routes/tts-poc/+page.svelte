<script lang="ts">
	import { onDestroy } from 'svelte';
	import { PUBLIC_API_URL } from '$env/static/public';

	const SAMPLE_TEXT =
		"That's a great question! Let me explain how this works in simple terms. " +
		'Learning a new language is like building muscle — consistency matters more than intensity. ' +
		"Try using this phrase in a real conversation today, and you'll remember it much faster.";

	type Status = 'idle' | 'loading' | 'playing' | 'error';

	let status = $state<Status>('idle');
	let errorDetail = $state('');
	let objectUrl = $state<string | null>(null);
	let audioEl = $state<HTMLAudioElement | null>(null);

	const statusLabel = $derived(
		status === 'loading'
			? 'loading…'
			: status === 'playing'
				? 'playing'
				: status === 'error'
					? 'error'
					: 'idle'
	);

	const statusLine = $derived(
		status === 'error' && errorDetail ? `${statusLabel}: ${errorDetail}` : statusLabel
	);

	function revokeObjectUrl() {
		if (objectUrl) {
			URL.revokeObjectURL(objectUrl);
			objectUrl = null;
		}
	}

	async function fetchTtsBlob(text: string): Promise<Blob> {
		const res = await fetch(`${PUBLIC_API_URL}/api/v1/tts/speak`, {
			method: 'POST',
			credentials: 'include',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ text })
		});

		if (!res.ok) {
			const data: unknown = await res.json().catch(() => ({}));
			if (res.status === 401) {
				throw new Error('Log in first, then try again.');
			}
			const msg =
				typeof data === 'object' &&
				data !== null &&
				'error' in data &&
				typeof (data as { error: unknown }).error === 'string'
					? (data as { error: string }).error
					: `TTS failed (${res.status})`;
			throw new Error(msg);
		}

		const blob = await res.blob();

		if (blob.size < 100) {
			throw new Error(
				'API returned incomplete audio (mock mode). Set ELEVENLABS_API_KEY on ord-api — the backend returns a 4-byte stub when the key is missing or dummy-key.'
			);
		}

		return blob;
	}

	async function speak() {
		status = 'loading';
		errorDetail = '';

		try {
			revokeObjectUrl();
			audioEl?.pause();

			const blob = await fetchTtsBlob(SAMPLE_TEXT);
			const url = URL.createObjectURL(blob);
			objectUrl = url;

			const audio = audioEl;
			if (!audio) {
				throw new Error('Audio element not available');
			}

			audio.src = url;
			await audio.play();
			status = 'playing';
		} catch (err) {
			status = 'error';
			errorDetail = err instanceof Error ? err.message : 'Request failed';
			console.error(err);
		}
	}

	onDestroy(() => {
		revokeObjectUrl();
	});
</script>

<div class="flex h-full min-h-0 flex-col items-center justify-center gap-4 p-8">
	<button
		type="button"
		onclick={speak}
		disabled={status === 'loading'}
		class="w-full min-h-[120px] rounded-lg border border-primary-600 bg-primary-600 text-3xl font-semibold text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
	>
		🔊 Speak test
	</button>

	<p class="text-sm text-gray-500 dark:text-gray-400">{statusLine}</p>

	<audio bind:this={audioEl} controls playsinline class="w-full max-w-xl"></audio>
</div>
