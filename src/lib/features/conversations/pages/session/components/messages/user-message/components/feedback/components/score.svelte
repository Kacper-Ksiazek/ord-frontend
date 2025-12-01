<script lang="ts">
	import { cn } from 'flowbite-svelte';

	interface ScoreProps {
		field: string;
		score: number;
	}

	const { field, score }: ScoreProps = $props();

	const backgroundColor = $derived.by(() => {
		switch (true) {
			case score === 10:
				return 'bg-green-600';
			case score >= 8:
				return 'bg-green-400';
			case score >= 6:
				return 'bg-amber-300';
			case score >= 4:
				return 'bg-orange-300';
			case score >= 2:
				return 'bg-red-400';
			default:
				return 'bg-red-600';
		}
	});
</script>

<span
	class={cn(
		'flex items-center gap-1' //
	)}
>
	<div class={cn('w-5 h-5 bg-slate-300 rounded-sm', backgroundColor)}></div>
	<span>{field}: </span>
	<strong class={cn('font-bold text-lg')}>{score}/10</strong>
</span>
