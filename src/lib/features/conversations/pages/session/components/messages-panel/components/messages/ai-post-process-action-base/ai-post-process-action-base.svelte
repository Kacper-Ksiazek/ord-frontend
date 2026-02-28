<script lang="ts">
	import isFunction from 'lodash/isFunction';
	import { cn } from 'flowbite-svelte';
	import { Sparkles } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { Tooltip, type TooltipProps } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';
	import ToggleIconsInHighlight from './components/toggle-icons-in-highlight.svelte';
	import ToggleExpandCollapse from './components/toggle-expand-collapse.svelte';

	interface LearningTipsProps {
		label: string;
		class?: string;
		isGenerating?: boolean;
		tooltipContent: string;
		tooltipPlacement?: TooltipProps['placement'];
		showIconsInHighlightedParts: boolean;
		children: Snippet;
		actions: Snippet;
		onclick?: () => void;
	}

	let {
		label,
		tooltipContent,
		tooltipPlacement = 'left-start',
		isGenerating = false,
		class: customClass = '',
		showIconsInHighlightedParts = $bindable(),
		children,
		actions,
		onclick
	}: LearningTipsProps = $props();

	const isClickable = isFunction(onclick);

	let isCollapsed = $state(false);

	const id = `ai-post-process-action-base-${crypto.randomUUID()}`;
</script>

<Tooltip triggeredBy={`#${id}`} placement={tooltipPlacement}>
	{tooltipContent}
</Tooltip>

<div
	{id}
	transition:fade
	class={cn(
		'flex flex-col gap-3 px-4 py-3 mt-2 rounded-md w-full', //
		'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 transition-all text-gray-900 dark:text-gray-100',
		customClass,
		isClickable && 'hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer',
		isGenerating && 'generation-in-progress'
	)}
	{...isClickable
		? {
				onclick,
				onkeydown: (e) => {
					if (e.key === 'Enter' || e.key === ' ') {
						onclick?.();
					}
				},
				role: 'button',
				tabIndex: 0
			}
		: {}}
>
	<div class="bg-red-500 w-full flex gap-2">
		<!-- Label -->
		<div
			class={cn(
				'flex text-gray-500 dark:text-gray-400 items-center gap-1 flex-1',
				isGenerating && 'text-gray-400 dark:text-gray-400'
			)}
		>
			<Sparkles class="w-4 h-4" />
			<span class="text-sm font-medium">{label}</span>
		</div>

		<!-- Actions -->
		<div class="flex items-center gap-1">
			{@render actions()}
		</div>

		<!-- Toggle icons in highlighted parts -->
		<div class="flex items-center gap-1">
			<ToggleExpandCollapse bind:isCollapsed />
			<ToggleIconsInHighlight bind:showIconsInHighlightedParts />
		</div>
	</div>

	<div class="flex flex-col">
		{@render children()}
	</div>
</div>
