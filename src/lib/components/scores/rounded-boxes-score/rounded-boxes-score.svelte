<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { getScoreBoxColor } from '$conversations/pages/session/constants/score-colors';

	interface ScoreProps {
		field: string;
		score: number;
	}

	const { field, score }: ScoreProps = $props();

	const boxColor = $derived(getScoreBoxColor(score));

	const fillWidth = $derived(`${score * 10}%`);
</script>

<div class={cn('flex items-center gap-3 p-1 rounded-md text-content-card')}>
	<div class={cn('w-6 h-6 rounded-full flex items-center justify-center shrink-0', boxColor)}>
		<span class="text-xs font-bold text-white dark:text-white">
			{score}
		</span>
	</div>

	<span class="whitespace-nowrap min-w-[96px] text-sm">
		{field}
	</span>

	<div class="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
		<div class={cn('h-full rounded-full transition-all', boxColor)} style="width: {fillWidth}"></div>
	</div>
</div>
