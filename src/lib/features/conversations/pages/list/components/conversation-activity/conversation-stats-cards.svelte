<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { ConversationListActivitySnapshot } from '$lib/types/conversation/api/conversation-list-activity';
	import { LineChartCard } from '$lib/components/cards/line-chart-card';
	import {
		buildConversationsTrendMock,
		buildMessagesTrendSeries
	} from '$lib/features/conversations/pages/list/mocks/conversation-activity.mock';

	interface Props {
		activity: ConversationListActivitySnapshot;
		class?: string;
	}

	const { activity, class: className }: Props = $props();

	const messagesTrend = $derived(buildMessagesTrendSeries(activity.daily, 14));
	const conversationsTrend = $derived(buildConversationsTrendMock(activity.daily, 14));
</script>

<div class={cn('flex gap-4 min-w-[400px] flex-1', className)}>
	<LineChartCard
		title="Messages"
		value={activity.stats.messagesCount}
		data={messagesTrend}
		variant="neutral"
		class="flex-1 min-w-0"
		chartAriaLabel="Messages per day over the last two weeks"
	/>

	<LineChartCard
		title="Conversations"
		value={activity.stats.conversationsCount}
		data={conversationsTrend}
		variant="neutral"
		class="flex-1 min-w-0"
		chartAriaLabel="Conversations trend over the last two weeks (mock series)"
	/>
</div>
