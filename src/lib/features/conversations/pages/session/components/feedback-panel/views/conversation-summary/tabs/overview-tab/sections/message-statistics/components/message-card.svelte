<script lang="ts">
	import { getTailwindColorTheme } from '$lib/utils/theme/get-tailwind-colors';
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

	interface MessageCardProps {
		avatar: Snippet;
		label: string;
		messageCount: number;
		stats: {
			Icon: LucideIcon;
			color: TailwindColor;
			value: number;
		}[];
	}

	const { avatar, label, messageCount, stats }: MessageCardProps = $props();
</script>

<div
	class="p-6 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700/60 rounded-lg"
>
	<div class="flex items-center gap-3 mb-5">
		<div class="shrink-0">
			{@render avatar()}
		</div>
		<div class="flex-1">
			<div class="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">
				{messageCount}
			</div>
			<div class="text-sm text-slate-500 dark:text-gray-400 uppercase tracking-wider">
				{label}
			</div>
		</div>
	</div>

	<div class="flex items-center gap-6 pt-4 border-t border-slate-100 dark:border-gray-700/50">
		{#each stats as stat, i (i)}
			{@const colors = getTailwindColorTheme(stat.color)}

			<div class="flex items-center gap-2">
				<stat.Icon class={cn('w-5 h-5', colors.iconColor)} />
				<span class="text-sm font-medium text-slate-600 dark:text-gray-300">{stat.value}</span>
			</div>
		{/each}
	</div>
</div>
