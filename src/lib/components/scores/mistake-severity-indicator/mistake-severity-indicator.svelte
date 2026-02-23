<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import {
		CONVERSATION_MESSAGE_MISTAKE_SEVERITY_LEVEL_MAP,
		type ConversationMessageMistakeSeverity
	} from '$lib/types/conversation/domain/conversation-message-feedback';

	interface Props {
		severity: ConversationMessageMistakeSeverity;
		showLabel?: boolean;
		class?: string;
	}

	let { severity, showLabel = true, class: className = '' }: Props = $props();

	const severityLevel = CONVERSATION_MESSAGE_MISTAKE_SEVERITY_LEVEL_MAP[severity];
	const severityLabel = severity.charAt(0) + severity.slice(1).toLowerCase();
</script>

<div class={cn('flex flex-col items-center gap-0.5', className)}>
	<div class="flex items-center gap-1">
		{#each [0, 1, 2] as i (i)}
			<div
				class={cn(
					'w-2.5 h-2.5 rounded-sm',
					severityLevel > i ? 'bg-red-600 dark:bg-red-400' : 'bg-gray-300 dark:bg-gray-700'
				)}
			></div>
		{/each}
	</div>
	{#if showLabel}
		<span class="text-xs text-gray-600 dark:text-gray-400">{severityLabel}</span>
	{/if}
</div>
