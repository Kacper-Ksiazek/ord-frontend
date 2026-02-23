<script lang="ts">
	import { getTailwindColorTheme } from '$lib/utils/theme/get-tailwind-colors';
	import { cn } from 'flowbite-svelte';
	import { ChartBar } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface MessageCardProps {
		avatar: Snippet;
		label: string;
		messageCount: number;
		averageCharacters: number | null;
		stats: {
			Icon: LucideIcon;
			color: TailwindColor;
			value: number;
		}[];
	}

	const { avatar, label, messageCount, averageCharacters, stats }: MessageCardProps = $props();
</script>

<div class="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
	<div class="flex items-center gap-3 mb-3">
		<div class="shrink-0">
			{@render avatar()}
		</div>
		<div class="flex-1">
			<div class="heading-3">{messageCount}</div>
			<div class="caption">{label}</div>
		</div>
	</div>

	<div
		class="mb-3 border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 bg-gray-50 dark:bg-gray-900/50"
	>
		<div class="flex items-center gap-2 mb-1">
			<ChartBar class="w-4 h-4 text-gray-500 dark:text-gray-400 shrink-0" />
			<span class="label-small">Average length</span>
		</div>
		<div class="heading-6">
			{averageCharacters !== null ? `${averageCharacters.toLocaleString()} characters` : 'N/A'}
		</div>
		<div class="caption-muted mt-0.5">per message</div>
	</div>

	<div class="flex gap-2">
		{#each stats as stat, i (i)}
			{@const colors = getTailwindColorTheme(stat.color)}

			<div
				class={cn(
					'flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg',
					colors.cardBg,
					colors.cardBorder
				)}
			>
				<stat.Icon class={cn('w-5 h-5', colors.iconColor)} />
				<span class="stat-value">{stat.value}</span>
			</div>
		{/each}
	</div>
</div>
