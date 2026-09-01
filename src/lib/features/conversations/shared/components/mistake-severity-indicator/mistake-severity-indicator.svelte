<script lang="ts">
	import { cn } from '$lib/utils/cn';
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
		 * `stack` — dots above label (chart legend). `inline` — dots then label on one row (e.g. mistake card).
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
	<div class={cn('flex items-center gap-0.5', isInline && 'shrink-0')}>
		{#each [0, 1, 2] as i (i)}
			<div
				class={cn('h-1.5 w-1.5 rounded-sm', hasMistakes && severityLevel > i ? 'bg-danger' : 'bg-line')}
			></div>
		{/each}
	</div>
	{#if isInline && showLabel}
		<span class="whitespace-nowrap text-xs text-ink-muted">{severityLabel}</span>
	{/if}
	{#if !isInline && showLabel}
		<span class="text-xs text-ink-muted">{severityLabel}</span>
	{/if}
</div>
