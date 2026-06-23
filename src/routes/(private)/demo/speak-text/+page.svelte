<script lang="ts">
	import { onDestroy } from 'svelte';
	import { fade } from 'svelte/transition';
	import { Button } from '$lib/components/buttons/button';
	import { speakText, stopSpeaking } from '$lib/utils/speak-text';
	import { formatTime } from '$lib/utils/format-time';

	const PRESETS = [
		'Hello, this is a TTS test.',
		'Bonjour! Comment ça va?',
		'The quick brown fox jumps over the lazy dog.'
	] as const;

	let text = $state('Hello, this is a TTS test.');
	let status = $state('');
	let busy = $state(false);
	let progress = $state(0);
	let duration = $state(0);

	const canSpeak = $derived(text.trim().length > 0 && !busy);
	const canStop = $derived(busy);
	const showProgress = $derived(busy && duration > 0);
	const progressPercent = $derived(duration > 0 ? Math.min(100, (progress / duration) * 100) : 0);

	function resetProgress() {
		progress = 0;
		duration = 0;
	}

	async function onSpeak() {
		const trimmed = text.trim();

		if (!trimmed) {
			return;
		}

		busy = true;
		resetProgress();
		status = 'Loading audio…';

		try {
			status = 'Playing…';
			const result = await speakText(trimmed, {
				onProgress: ({ currentTime, duration: totalDuration }) => {
					progress = currentTime;
					duration = totalDuration;
				}
			});

			if (result) {
				status = `Done (${formatTime(result.duration)})`;
			} else {
				status = '';
			}
		} catch (err) {
			status = err instanceof Error ? err.message : 'Request failed';
		} finally {
			busy = false;
		}
	}

	function onStop() {
		stopSpeaking();
		busy = false;
		resetProgress();
		status = 'Stopped';
	}

	function usePreset(preset: string) {
		text = preset;
	}

	onDestroy(() => {
		stopSpeaking();
	});
</script>

<div class="mx-auto flex w-full max-w-2xl flex-col gap-6 p-8">
	<div class="flex flex-col gap-2">
		<h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Speak text (TTS)</h1>
		<p class="text-sm text-gray-500 dark:text-gray-400">
			POC for <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">speakText()</code>. Requires a
			logged-in session.
		</p>
	</div>

	<label class="flex flex-col gap-2">
		<span class="text-sm font-medium text-gray-700 dark:text-gray-300">Text to speak</span>
		<textarea
			bind:value={text}
			rows="4"
			disabled={busy}
			class="form-input-text w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
		></textarea>
	</label>

	<div class="flex flex-wrap gap-2">
		{#each PRESETS as preset (preset)}
			<button
				type="button"
				disabled={busy}
				onclick={() => usePreset(preset)}
				class="rounded-full border border-gray-300 px-3 py-1 text-sm text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
			>
				{preset}
			</button>
		{/each}
	</div>

	<div class="flex flex-wrap gap-3">
		<Button disabled={!canSpeak} onClick={onSpeak}>Speak</Button>
		<Button type="OUTLINED" variant="TEXT" disabled={!canStop} onClick={onStop}>Stop</Button>
	</div>

	{#if showProgress}
		<div class="flex flex-col gap-2" aria-live="polite" transition:fade={{ duration: 200 }}>
			<div
				class="h-2 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
				role="progressbar"
				aria-valuemin="0"
				aria-valuemax={duration}
				aria-valuenow={progress}
				aria-label="Playback progress"
			>
				<div
					class="h-full w-full origin-left rounded-full bg-primary-600 will-change-transform transition-transform duration-300 ease-linear"
					style:transform="scaleX({progressPercent / 100})"
				></div>
			</div>
			<p class="text-sm text-gray-500 dark:text-gray-400">
				{formatTime(progress)} / {formatTime(duration)}
			</p>
		</div>
	{/if}

	{#if status}
		<p class="text-sm text-gray-500 dark:text-gray-400" aria-live="polite">{status}</p>
	{/if}
</div>
