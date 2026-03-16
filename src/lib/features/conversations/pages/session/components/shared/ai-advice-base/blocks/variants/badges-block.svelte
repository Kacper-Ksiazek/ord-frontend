<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import type { BadgesBlock } from '../../ai-advice.types';
	import type { TailwindColorTheme } from '$lib/utils/theme/get-tailwind-colors';

	interface Props {
		block: BadgesBlock;
		theme: TailwindColorTheme;
	}

	let { block, theme }: Props = $props();
</script>

<div class="flex items-start justify-between mb-2">
	<div class="flex gap-2">
		{#each block.badges as badge (badge.text)}
			<Badge color={theme.twColor} class="flex items-center gap-1">
				{#if badge.Icon}
					<badge.Icon class="w-4 h-4" />
				{/if}
				{badge.text}
			</Badge>
		{/each}
	</div>

	{#if block.severity}
		<div class="flex items-start gap-2">
			<block.severity.Icon class={cn('w-5 h-5 mt-0.5', theme.iconColor)} />
			<!-- TODO: Add MistakeSeverityIndicator component -->
			<span class="text-sm text-gray-600 dark:text-gray-400">{block.severity.value}</span>
		</div>
	{/if}
</div>
