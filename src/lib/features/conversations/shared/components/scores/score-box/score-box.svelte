<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { getScoreBoxColor } from '$conversations/shared/components/scores/constants/score-colors';

	interface ScoreBoxProps {
		score: number | null;
	}

	const { score }: ScoreBoxProps = $props();

	const boxColor = $derived(
		score !== null ? getScoreBoxColor(score) : 'bg-gray-200 dark:bg-gray-800'
	);
	const textColor = $derived(score !== null ? 'text-on-color' : 'text-gray-500 dark:text-gray-400');
	const displayValue = $derived(score !== null ? score : '—');
</script>

<div class={cn('w-8 h-8 rounded-full flex items-center justify-center', boxColor)}>
	<span class={cn('text-sm', textColor)}>
		{displayValue}
	</span>
</div>
