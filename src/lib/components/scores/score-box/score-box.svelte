<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { getScoreChipClasses } from '$lib/components/scores/constants/score-colors';

	interface ScoreBoxProps {
		score: number | null;
	}

	const { score }: ScoreBoxProps = $props();

	const chip = $derived(
		score !== null ? getScoreChipClasses(score) : { bg: 'bg-accent-soft', text: 'text-ink-subtle' }
	);
	const displayValue = $derived(score !== null ? score : '—');
</script>

<div class={cn('flex size-8 items-center justify-center rounded-full', chip.bg)}>
	<span class={cn('text-sm font-semibold', chip.text)}>
		{displayValue}
	</span>
</div>
