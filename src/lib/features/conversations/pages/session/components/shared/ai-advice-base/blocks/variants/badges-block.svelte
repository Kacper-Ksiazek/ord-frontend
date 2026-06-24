<script lang="ts">
	import { Badge, cn } from 'flowbite-svelte';
	import { MistakeSeverityIndicator } from '$lib/components/data-display';
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
		<div class="flex items-center gap-2 shrink-0">
			{#if block.severity.Icon}
				<block.severity.Icon class={cn('w-5 h-5 shrink-0', theme.iconColor)} />
			{/if}
			<MistakeSeverityIndicator severity={block.severity.value} layout="inline" class="shrink-0" />
		</div>
	{/if}
</div>
