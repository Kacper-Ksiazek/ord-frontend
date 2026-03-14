<script lang="ts">
	import './ai-advice-base-v2.css';
	import { slide } from 'svelte/transition';
	import { cn } from 'flowbite-svelte';
	import type { AiAdviceBaseV2Props } from './ai-advice.types';
	import { getTailwindColorTheme } from '$lib/utils/theme/get-tailwind-colors';
	import BlockRenderer from './blocks/block-renderer.svelte';

	let { headerBlocks, bodyBlocks, color }: AiAdviceBaseV2Props = $props();

	const theme = getTailwindColorTheme(color);
	let isCollapsed = $state(false);
</script>

<div
	class={cn('feedback-card-container cursor-pointer', theme.cardBg, theme.cardBorder)}
	onclick={() => (isCollapsed = !isCollapsed)}
	role="button"
	tabindex="0"
	onkeydown={(e) => e.key === 'Enter' && (isCollapsed = !isCollapsed)}
>
	<div class="feedback-card-header">
		{#each headerBlocks as block (block)}
			<BlockRenderer {block} {theme} />
		{/each}
	</div>

	{#if !isCollapsed}
		<div transition:slide={{ duration: 150 }}>
			{#each bodyBlocks as block (block)}
				<BlockRenderer {block} {theme} />
			{/each}
		</div>
	{/if}
</div>
