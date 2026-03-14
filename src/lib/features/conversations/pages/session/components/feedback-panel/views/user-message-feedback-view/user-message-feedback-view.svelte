<script lang="ts">
	import size from 'lodash/size';
	import { getMessagesContext } from '../../../../contexts/messages-context.svelte';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import { OverviewTab } from './tabs';
	import { ChartBar, MessageSquare } from 'lucide-svelte';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import UserMessageReviewListWithFilters from '../../components/user-message-review-list-with-filters/user-message-review-list-with-filters.svelte';

	type UserMessageFeedbackTab = 'overview' | 'feedback';

	interface Props {
		feedback: ConversationUserMessageFeedbackDTO;
	}

	let { feedback }: Props = $props();

	const messagesContext = getMessagesContext();
	const messages = $derived(messagesContext.messages);

	const userMessages: CompactConversationUserMessage[] = $derived(
		messages.filter((msg) => msg.sender === 'USER')
	);

	const currentMessage: CompactConversationUserMessage | null = $derived(
		userMessages.find((msg) => msg.feedback?.id === feedback.id) ?? null
	);

	const feedbackCount = $derived(
		size(feedback.mistakes) + size(feedback.strengths) + size(feedback.suggestions)
	);

	let activeMainTab = $state<UserMessageFeedbackTab>('overview');

	const mainTabs = $derived<Tab<UserMessageFeedbackTab>[]>([
		{ id: 'overview', label: 'Overview', icon: ChartBar },
		{
			id: 'feedback',
			label: 'Feedback',
			count: feedbackCount,
			icon: MessageSquare,
			disabled: feedbackCount === 0
		}
	]);
</script>

{#if currentMessage}
	<div class="flex flex-col h-full min-h-0">
		<div class="shrink-0 space-y-6">
			<h2 class="heading-4 mb-4">Feedback Details</h2>

			<Tabs
				tabs={mainTabs}
				bind:activeTab={activeMainTab}
				activeColor="primary"
				variant="outlined"
				class="mb-6"
			/>
		</div>

		<div class="flex-1 min-h-0 flex flex-col">
			{#if activeMainTab === 'overview'}
				<OverviewTab {feedback} messageContent={currentMessage?.content ?? null} {userMessages} />
			{/if}

			{#if activeMainTab === 'feedback'}
				<UserMessageReviewListWithFilters data={currentMessage} />
			{/if}
		</div>
	</div>
{/if}
