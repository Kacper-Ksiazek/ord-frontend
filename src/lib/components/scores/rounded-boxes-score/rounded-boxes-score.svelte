<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { getScoreChipClasses } from '$lib/components/scores/constants/score-colors';

	interface ScoreProps {
		field: string;
		score: number;
	}

	const { field, score }: ScoreProps = $props();

	const chip = $derived(getScoreChipClasses(score));
</script>

<div class={cn('flex items-center gap-3 rounded-md p-1')}>
	<div class={cn('flex size-8 shrink-0 items-center justify-center rounded-full', chip.bg)}>
		<span class={cn('font-semibold', chip.text)}>
			{score}
		</span>
	</div>

	<span class="min-w-[96px] whitespace-nowrap text-sm text-ink-muted">
		{field}
	</span>
</div>
