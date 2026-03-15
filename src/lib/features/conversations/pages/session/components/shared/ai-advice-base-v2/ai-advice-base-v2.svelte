<script lang="ts">
	import './ai-advice-base-v2.css';
	import { slide } from 'svelte/transition';
	import { cn } from 'flowbite-svelte';
	import type { AiAdviceBaseV2Props } from './ai-advice.types';
	import { getTailwindColorTheme } from '$lib/utils/theme/get-tailwind-colors';
	import BlockRenderer from './blocks/block-renderer.svelte';

	let {
		headerBlocks,
		bodyBlocks,
		color,
		isExpandable = true,
		defaultExpandState = false
	}: AiAdviceBaseV2Props = $props();

	const theme = getTailwindColorTheme(color);
	let isCollapsed = $state(!defaultExpandState);
	let cardElement = $state<HTMLDivElement | undefined>(undefined);

	function toggleExpandCollapse() {
		const wasCollapsed = isCollapsed;
		isCollapsed = !isCollapsed;

		if (wasCollapsed && isExpandable) {
			setTimeout(() => {
				cardElement?.scrollIntoView({
					behavior: 'smooth',
					block: 'nearest'
				});
			}, 200);
		}
	}
</script>

<div
	bind:this={cardElement}
	class={cn(
		'feedback-card-container',
		isExpandable && 'cursor-pointer expandable',
		theme.cardBg,
		theme.cardBorder
	)}
	{...isExpandable && {
		onclick: toggleExpandCollapse,
		role: 'button',
		tabindex: 0,
		onkeydown: (e) => e.key === 'Enter' && toggleExpandCollapse()
	}}
>
	<div class="flex flex-col gap-2">
		{#each headerBlocks as block (block)}
			<BlockRenderer {block} {theme} />
		{/each}
	</div>

	{#if !isCollapsed || !isExpandable}
		<div transition:slide={{ duration: 150 }} class="flex flex-col gap-2">
			{#each bodyBlocks as block (block)}
				<BlockRenderer {block} {theme} />
			{/each}
		</div>
	{/if}
</div>
