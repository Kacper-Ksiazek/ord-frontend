<script lang="ts">
	import { cn } from 'flowbite-svelte';

	interface ScoreProps {
		field: string;
		score: number;
	}

	const { field, score }: ScoreProps = $props();

	const boxColor = $derived.by(() => {
		switch (true) {
			case score >= 8:
				return 'bg-green-500 dark:bg-green-400';
			case score >= 6:
				return 'bg-amber-500 dark:bg-amber-400';
			case score >= 4:
				return 'bg-orange-500 dark:bg-orange-400';
			case score >= 2:
				return 'bg-red-500 dark:bg-red-400';
			default:
				return 'bg-red-500 dark:bg-red-400';
		}
	});

	const boxes = Array.from({ length: 10 }, (_, i) => i + 1);
</script>

<div class={cn('flex items-center gap-3')}>
	<!-- Label -->
	<span class="whitespace-nowrap w-[96px]">
		{field}
	</span>

	<!-- 10 Boxes -->
	<div class="flex items-center gap-0.5">
		{#each boxes as boxIndex}
			<div
				class={cn(
					'w-4 h-4 rounded-sm border',
					boxIndex <= score
						? `${boxColor} border-transparent`
						: 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600'
				)}
			></div>
		{/each}
	</div>

	<!-- Rating -->
	<span class="font-semibold">
		{score}
	</span>
</div>
