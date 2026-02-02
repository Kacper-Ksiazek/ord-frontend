<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { Tween } from 'svelte/motion';
	import { cubicOut } from 'svelte/easing';
	import { getScoreColorClasses } from '$lib/features/conversations/pages/session/consts/score-colors';
	import type { CircularProgressBarProps } from './circular-progress-bar.types';

	let {
		label,
		score,
		maxScore = 10,
		size = 120,
		strokeWidth = 8,
		class: className = ''
	}: CircularProgressBarProps = $props();

	const progressTween = new Tween(0, { duration: 1000, easing: cubicOut });

	$effect(() => {
		const targetValue = score !== null ? (score / maxScore) * 100 : 0;
		progressTween.target = targetValue;
	});

	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;
	const center = size / 2;

	const colorClasses = $derived(getScoreColorClasses(score));

	const offset = $derived(circumference - (progressTween.current / 100) * circumference);

	function formatScore(score: number | null): string {
		if (score === null) return 'N/A';

		return score.toFixed(1);
	}
</script>

<div class={cn('flex flex-col items-center gap-2', className)}>
	<div class="relative" style="width: {size}px; height: {size}px;">
		<svg width={size} height={size} class="transform -rotate-90">
			<!-- Background circle -->
			<circle
				cx={center}
				cy={center}
				r={radius}
				fill="none"
				stroke-width={strokeWidth}
				class={colorClasses.bg}
			/>
			<!-- Progress circle -->
			{#if score !== null}
				<circle
					cx={center}
					cy={center}
					r={radius}
					fill="none"
					stroke-width={strokeWidth}
					class={colorClasses.stroke}
					stroke-dasharray={circumference}
					stroke-dashoffset={offset}
					stroke-linecap="round"
				/>
			{/if}
		</svg>
		<!-- Score text in center -->
		<div class={cn('absolute inset-0 flex flex-col items-center justify-center', colorClasses.value)}>
			<span class="text-2xl font-bold">{formatScore(score)}</span>
			<span class="text-xs opacity-70">/ {maxScore}</span>
		</div>
	</div>
	<!-- Label -->
	<span class={cn('text-sm font-medium text-center', colorClasses.text)}>
		{label}
	</span>
</div>
