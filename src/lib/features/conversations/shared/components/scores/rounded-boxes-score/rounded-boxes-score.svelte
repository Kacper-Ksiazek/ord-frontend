<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { getScoreBoxColor } from '$conversations/shared/components/scores/constants/score-colors';

	interface ScoreProps {
		field: string;
		score: number;
	}

	const { field, score }: ScoreProps = $props();

	const boxColor = $derived(getScoreBoxColor(score));
</script>

<div class={cn('flex items-center gap-3 p-1 rounded-md')}>
	<div class={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', boxColor)}>
		<span class="font-bold text-white dark:text-white">
			{score}
		</span>
	</div>

	<span class="whitespace-nowrap min-w-[96px]">
		{field}
	</span>
</div>
