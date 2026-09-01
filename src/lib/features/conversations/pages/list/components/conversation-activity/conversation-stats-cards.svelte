<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import type { ConversationActivityOverview } from '$conversations/types';
	import { LineChartCard } from '$lib/components/cards/line-chart-card';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		activity: ConversationActivityOverview;
		class?: string;
	}

	const { activity, class: className = '' }: Props = $props();

	const messagesTrend = $derived(
		activity.messagesByWeek.map((w) => ({ label: w.weekRange, value: w.count }))
	);
	const conversationsTrend = $derived(
		activity.conversationsByWeek.map((w) => ({ label: w.weekRange, value: w.count }))
	);
</script>

<div class={cn('flex min-w-0 flex-1 flex-col gap-3 sm:flex-row', className)}>
	<LineChartCard
		title={m['features.conversation.list.activity.messages']()}
		value={activity.messagesTotal}
		data={messagesTrend}
		variant="neutral"
		class="min-w-0 flex-1 border-line bg-surface"
		chartAriaLabel={m['features.conversation.list.activity.messages_chart_aria']()}
	/>

	<LineChartCard
		title={m['features.conversation.list.activity.conversations']()}
		value={activity.conversationsTotal}
		data={conversationsTrend}
		variant="neutral"
		class="min-w-0 flex-1 border-line bg-surface"
		chartAriaLabel={m['features.conversation.list.activity.conversations_chart_aria']()}
	/>
</div>
