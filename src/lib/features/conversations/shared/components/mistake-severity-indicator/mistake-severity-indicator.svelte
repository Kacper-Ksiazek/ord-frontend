<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import {
		CONVERSATION_MESSAGE_MISTAKE_SEVERITY_LEVEL_MAP,
		type ConversationMessageMistakeSeverity
	} from '$conversations/types';

	interface Props {
		severity: ConversationMessageMistakeSeverity;
		showLabel?: boolean;
		class?: string;
		/** When false, all segments are gray (e.g. no mistakes in this category on the chart). */
		hasMistakes?: boolean;
		/**
		 * `stack` — dots above label (chart legend). `inline` — label then dots on one row (e.g. mistake card).
		 */
		layout?: 'stack' | 'inline';
	}

	let {
		severity,
		showLabel = true,
		class: className = '',
		hasMistakes = true,
		layout = 'stack'
	}: Props = $props();

	const severityLevel = $derived(CONVERSATION_MESSAGE_MISTAKE_SEVERITY_LEVEL_MAP[severity]);
	const severityLabel = $derived(severity.charAt(0) + severity.slice(1).toLowerCase());
	const isInline = $derived(layout === 'inline');
</script>

<div
	class={cn(
		isInline ? 'flex flex-row items-center gap-2' : 'flex flex-col items-center gap-0.5',
		className
	)}
>
	{#if isInline && showLabel}
		<span class="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">{severityLabel}</span>
	{/if}
	<div class={cn('flex items-center gap-1', isInline && 'shrink-0')}>
		{#each [0, 1, 2] as i (i)}
			<div
				class={cn(
					'w-2.5 h-2.5 rounded-sm',
					hasMistakes && severityLevel > i
						? 'bg-red-600 dark:bg-red-400'
						: 'bg-gray-300 dark:bg-gray-700'
				)}
			></div>
		{/each}
	</div>
	{#if !isInline && showLabel}
		<span class="text-xs text-gray-600 dark:text-gray-400">{severityLabel}</span>
	{/if}
</div>
