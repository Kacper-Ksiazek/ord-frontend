<script lang="ts">
	import { fade } from 'svelte/transition';
	import PlaybackProgressBar from '$lib/components/playback-progress-bar/playback-progress-bar.svelte';
	import { speakTextPlayback } from '$lib/utils/speak-text.svelte';

	interface PlayMessageAudioProgressProps {
		messageIndex: number;
	}

	let { messageIndex }: PlayMessageAudioProgressProps = $props();

	const showPlaybackProgress = $derived(
		speakTextPlayback.id === messageIndex && speakTextPlayback.progress.duration > 0
	);
</script>

{#if showPlaybackProgress}
	<div transition:fade={{ duration: 200 }}>
		<PlaybackProgressBar
			currentTime={speakTextPlayback.progress.currentTime}
			duration={speakTextPlayback.progress.duration}
		/>
	</div>
{/if}
