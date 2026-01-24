<script lang="ts">
	import isFunction from 'lodash/isFunction';
	import { cn } from 'flowbite-svelte';
	import { Sparkles } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import { Tooltip, type TooltipProps } from 'flowbite-svelte';
	import { fade } from 'svelte/transition';

	interface LearningTipsProps {
		label: string;
		class?: string;
		isGenerating?: boolean;
		tooltipContent: string;
		tooltipPlacement?: TooltipProps['placement'];
		children: Snippet;
		onclick?: () => void;
	}

	const {
		label,
		tooltipContent,
		tooltipPlacement = 'left-start',
		isGenerating = false,
		class: customClass = '',
		children,
		onclick
	}: LearningTipsProps = $props();

	const isClickable = isFunction(onclick);

	const id = `ai-post-process-action-base-${crypto.randomUUID()}`;
</script>

<Tooltip triggeredBy={`#${id}`} placement={tooltipPlacement}>
	{tooltipContent}
</Tooltip>
<div
	{id}
	transition:fade
	class={cn(
		'flex flex-col gap-3 px-4 py-3 mt-2 rounded-md w-full bg-primary-100 dark:bg-primary-900 transition-all text-gray-900 dark:text-gray-100', //
		customClass,
		isClickable && 'hover:bg-primary-200 dark:hover:bg-primary-800 cursor-pointer',
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
	<div
		class={cn(
			'flex text-primary-700 dark:text-primary-300 items-center gap-1',
			isGenerating && 'text-gray-400 dark:text-gray-400'
		)}
	>
		<Sparkles class="w-4 h-4" />
		<span class="text-sm font-medium">{label}</span>
	</div>

	<div class="flex flex-col">
		{@render children()}
	</div>
</div>
