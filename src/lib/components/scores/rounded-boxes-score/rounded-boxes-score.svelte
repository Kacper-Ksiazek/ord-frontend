<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { getScoreBoxColor } from '$conversations/pages/session/constants/score-colors';

	interface ScoreProps {
		field: string;
		score: number;
	}

	const { field, score }: ScoreProps = $props();

	const boxColor = $derived(getScoreBoxColor(score));

	const boxes = Array.from({ length: 10 }, (_, i) => i + 1);
</script>

<div class={cn('flex items-center gap-2 p-1 rounded-md text-content-card')}>
	<div class={cn('w-4 h-4 rounded-sm p-3 flex items-center justify-center shadow-sm', boxColor)}>
		<span class="text-xs font-bold text-white dark:text-white">
			{score}
		</span>
	</div>

	<span class="whitespace-nowrap min-w-[96px] flex-1">
		{field}
	</span>

	<div class="flex items-center gap-0.5">
		{#each boxes as boxIndex}
			<div
				class={cn(
					'w-4 h-4 rounded-sm transition-colors',
					boxIndex <= score
						? `${boxColor}`
						: 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
				)}
			></div>
		{/each}
	</div>
</div>
