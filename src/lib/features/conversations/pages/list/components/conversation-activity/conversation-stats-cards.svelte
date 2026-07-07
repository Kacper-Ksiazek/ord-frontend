<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { ConversationActivityOverview } from '$lib/types/conversation/api/conversation-list-activity';
	import { LineChartCard } from '$lib/components/cards/line-chart-card';

	interface Props {
		activity: ConversationActivityOverview;
		class?: string;
	}

	const { activity, class: className }: Props = $props();

	const messagesTrend = $derived(
		activity.messagesByWeek.map((w) => ({ label: w.weekRange, value: w.count }))
	);
	const conversationsTrend = $derived(
		activity.conversationsByWeek.map((w) => ({ label: w.weekRange, value: w.count }))
	);
</script>

<div class={cn('flex gap-4 min-w-[400px] flex-1', className)}>
	<LineChartCard
		title="Messages"
		value={activity.messagesTotal}
		data={messagesTrend}
		variant="neutral"
		class="flex-1 min-w-0"
		chartAriaLabel="Messages per week over recent weeks"
	/>

	<LineChartCard
		title="Conversations"
		value={activity.conversationsTotal}
		data={conversationsTrend}
		variant="neutral"
		class="flex-1 min-w-0"
		chartAriaLabel="Conversations per week over recent weeks"
	/>
</div>
