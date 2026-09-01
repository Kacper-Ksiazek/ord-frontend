<script lang="ts">
	import './ai-advice-base.css';
	import { slide } from 'svelte/transition';
	import { cn } from '$lib/utils/cn';
	import type { AiAdviceBaseProps } from './ai-advice.types';
	import { getTailwindColorTheme } from '$conversations/shared/utils/get-tailwind-colors';
	import BlockRenderer from './blocks/block-renderer.svelte';

	let {
		headerBlocks,
		bodyBlocks,
		color,
		isExpandable = true,
		defaultExpandState = false,
		showCategoryLabel = false,
		categoryLabel,
		categoryIcon: CategoryIcon
	}: AiAdviceBaseProps = $props();

	const baseTheme = $derived(getTailwindColorTheme(color));
	const theme = $derived({
		...baseTheme,
		iconColor: baseTheme.adviceIconColor
	});
	let userCollapsedOverride = $state<boolean | undefined>(undefined);
	let scrollRef: HTMLElement | undefined = $state(undefined);

	$effect(() => {
		void defaultExpandState;
		userCollapsedOverride = undefined;
	});

	const isCollapsed = $derived(
		userCollapsedOverride !== undefined ? userCollapsedOverride : !defaultExpandState
	);

	function toggleExpandCollapse() {
		const wasCollapsed = isCollapsed;
		userCollapsedOverride = !isCollapsed;

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
		isExpandable
			? cn(
					'expandable cursor-pointer rounded-[10px] border p-3 transition-all',
					baseTheme.adviceCardBg,
					baseTheme.adviceCardBorder,
					baseTheme.adviceCardHover
				)
			: 'gap-4'
	)}
	{...isExpandable && {
		onclick: toggleExpandCollapse,
		role: 'button',
		tabindex: 0,
		onkeydown: (e) => e.key === 'Enter' && toggleExpandCollapse()
	}}
>
	<div class="flex flex-col gap-4">
		{#if showCategoryLabel && categoryLabel}
			<div
				class="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-ink-muted"
			>
				{#if CategoryIcon}
					<span
						class={cn(
							'flex size-5 shrink-0 items-center justify-center rounded-md',
							baseTheme.iconChipBg
						)}
					>
						<CategoryIcon class={cn('size-3.5 shrink-0', baseTheme.iconColor)} aria-hidden="true" />
					</span>
				{/if}
				<span>{categoryLabel}</span>
			</div>
		{/if}

		{#each headerBlocks as block (block)}
			<BlockRenderer {block} {theme} />
		{/each}
	</div>

	{#if !isCollapsed || !isExpandable}
		<div transition:slide={{ duration: 150 }} class="flex flex-col gap-4">
			{#each bodyBlocks as block (block)}
				<BlockRenderer {block} {theme} />
			{/each}
		</div>
	{/if}
</div>
