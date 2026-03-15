<script lang="ts">
	import './ai-advice-base-v2.css';
	import { slide } from 'svelte/transition';
	import { cn } from 'flowbite-svelte';
	import type { AiAdviceBaseV2Props } from './ai-advice.types';
	import { getTailwindColorTheme } from '$lib/utils/theme/get-tailwind-colors';
	import BlockRenderer from './blocks/block-renderer.svelte';

	let { headerBlocks, bodyBlocks, color, isExpandable = true }: AiAdviceBaseV2Props = $props();

	const theme = getTailwindColorTheme(color);
	let isCollapsed = $state(false);
</script>

<div
	class={cn(
		'feedback-card-container',
		isExpandable && 'cursor-pointer expandable',
		theme.cardBg,
		theme.cardBorder
	)}
	{...isExpandable && {
		onclick: () => (isCollapsed = !isCollapsed),
		role: 'button',
		tabindex: 0,
		onkeydown: (e) => e.key === 'Enter' && (isCollapsed = !isCollapsed)
	}}
>
	<div class="feedback-card-header">
		{#each headerBlocks as block (block)}
			<BlockRenderer {block} {theme} />
		{/each}
	</div>

	{#if !isCollapsed || !isExpandable}
		<div transition:slide={{ duration: 150 }}>
			{#each bodyBlocks as block (block)}
				<BlockRenderer {block} {theme} />
			{/each}
		</div>
	{/if}
</div>
