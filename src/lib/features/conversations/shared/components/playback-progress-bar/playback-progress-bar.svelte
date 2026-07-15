<script lang="ts">
	import { formatTime } from '$lib/utils/format-time';

	interface PlaybackProgressBarProps {
		currentTime: number;
		duration: number;
		barClass?: string;
		timeClass?: string;
	}

	let {
		currentTime,
		duration,
		barClass = 'h-1.5',
		timeClass = 'text-xs text-gray-500 dark:text-gray-400'
	}: PlaybackProgressBarProps = $props();

	const progressPercent = $derived(duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0);
</script>

<div class="flex flex-col gap-2" aria-live="polite">
	<div
		class="{barClass} overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
		role="progressbar"
		aria-valuemin="0"
		aria-valuemax={duration}
		aria-valuenow={currentTime}
		aria-label="Playback progress"
	>
		<div
			class="h-full w-full origin-left rounded-full bg-primary-600 will-change-transform transition-transform duration-300 ease-linear"
			style:transform="scaleX({progressPercent / 100})"
		></div>
	</div>
	<p class={timeClass}>
		{formatTime(currentTime)} / {formatTime(duration)}
	</p>
</div>
