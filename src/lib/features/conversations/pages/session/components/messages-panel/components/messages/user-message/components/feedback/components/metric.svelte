<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import FeedbackMetricIcon from '$lib/features/conversations/pages/session/components/shared/user-message-feedback/user-message-feedback-metric-icon.svelte';
	import { getUserMessageFeedbackColors } from '$conversations/pages/session/constants/user-message-feedback/colors';

	interface MetricProps {
		criteria: MessageFeedbackCriteria;
		count: number;
		label: string;
	}

	const { criteria, count, label }: MetricProps = $props();
</script>

{#if count > 0}
	<span
		class={cn(
			'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs border border-gray-200 dark:border-gray-700',
			'bg-gray-50 dark:bg-gray-800 caption'
		)}
	>
		<FeedbackMetricIcon
			{criteria}
			class={cn('w-4 h-4', getUserMessageFeedbackColors(criteria).text)}
		/>

		<span>{label}: <strong class="text-strong">{count}</strong></span>
	</span>
{/if}
