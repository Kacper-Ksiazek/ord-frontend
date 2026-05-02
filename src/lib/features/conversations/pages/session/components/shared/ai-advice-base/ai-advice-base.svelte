<script lang="ts">
	import './ai-advice-base.css';
	import { slide } from 'svelte/transition';
	import { cn } from 'flowbite-svelte';
	import type { AiAdviceBaseProps } from './ai-advice.types';
	import { getTailwindColorTheme } from '$lib/utils/theme/get-tailwind-colors';
	import BlockRenderer from './blocks/block-renderer.svelte';

	let {
		headerBlocks,
		bodyBlocks,
		color,
		isExpandable = true,
		defaultExpandState = false
	}: AiAdviceBaseProps = $props();

	const baseTheme = $derived(getTailwindColorTheme(color));
	const theme = $derived({
		...baseTheme,
		iconColor: baseTheme.adviceIconColor
	});
	let isCollapsed = $state(!defaultExpandState);
	let scrollRef: HTMLElement | undefined = $state(undefined);

	function toggleExpandCollapse() {
		const wasCollapsed = isCollapsed;
		isCollapsed = !isCollapsed;

		if (wasCollapsed && isExpandable) {
			setTimeout(() => {
				scrollRef?.scrollIntoView({
					behavior: 'smooth',
					block: 'start',
					inline: 'nearest'
				});
			}, 200);
		}
	}
</script>

<div
	bind:this={scrollRef}
	class={cn(
		'analysis-card-container relative group/advice-card',
		isExpandable && 'cursor-pointer expandable',
		baseTheme.adviceCardBg,
		baseTheme.adviceCardBorder,
		isExpandable && baseTheme.adviceCardHover
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
