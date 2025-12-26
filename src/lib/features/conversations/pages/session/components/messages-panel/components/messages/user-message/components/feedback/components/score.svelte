<script lang="ts">
	import { cn } from 'flowbite-svelte';

	interface ScoreProps {
		field: string;
		score: number;
	}

	const { field, score }: ScoreProps = $props();

	const chipStyles = $derived.by(() => {
		switch (true) {
			case score === 10:
				return {
					bg: 'bg-green-50 dark:bg-green-900/20',
					border: 'border-green-500 dark:border-green-400',
					innerBg: 'bg-green-500 dark:bg-green-400',
					innerText: 'text-white'
				};
			case score >= 8:
				return {
					bg: 'bg-green-50 dark:bg-green-900/20',
					border: 'border-green-500 dark:border-green-400',
					innerBg: 'bg-green-500 dark:bg-green-400',
					innerText: 'text-white'
				};
			case score >= 6:
				return {
					bg: 'bg-amber-50 dark:bg-amber-900/20',
					border: 'border-amber-500 dark:border-amber-400',
					innerBg: 'bg-amber-500 dark:bg-amber-400',
					innerText: 'text-white'
				};
			case score >= 4:
				return {
					bg: 'bg-orange-50 dark:bg-orange-900/20',
					border: 'border-orange-500 dark:border-orange-400',
					innerBg: 'bg-orange-500 dark:bg-orange-400',
					innerText: 'text-white'
				};
			case score >= 2:
				return {
					bg: 'bg-red-50 dark:bg-red-900/20',
					border: 'border-red-500 dark:border-red-400',
					innerBg: 'bg-red-500 dark:bg-red-400',
					innerText: 'text-white'
				};
			default:
				return {
					bg: 'bg-red-50 dark:bg-red-900/20',
					border: 'border-red-500 dark:border-red-400',
					innerBg: 'bg-red-500 dark:bg-red-400',
					innerText: 'text-white'
				};
		}
	});
</script>

<span
	class={cn(
		'inline-flex items-center rounded-md text-xs font-medium border overflow-hidden',
		chipStyles.bg,
		chipStyles.border
	)}
>
	<span
		class={cn(
			'inline-flex items-center justify-center px-2 py-1 text-xs font-bold flex-1',
			chipStyles.innerBg,
			chipStyles.innerText
		)}
	>
		{score}/10
	</span>

	<span class="text-gray-600 dark:text-gray-300 px-2 whitespace-nowrap">{field}</span>
</span>
