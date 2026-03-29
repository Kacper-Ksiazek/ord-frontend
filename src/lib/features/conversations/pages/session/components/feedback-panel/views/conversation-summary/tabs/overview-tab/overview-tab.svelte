<script lang="ts">
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import { MistakesSeverity, MetricsOverTime, PerformanceScores } from './sections';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import type { ConversationUserMessageAnalysisDTO } from '$lib/types/conversation/domain/conversation-message-analysis';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';

	const messagesContext = getMessagesContext();

	const messages = $derived(messagesContext.messages);

	const userMessages: CompactConversationUserMessage[] = $derived(
		messages.filter((msg) => msg.sender === 'USER')
	);
	const analyses: ConversationUserMessageAnalysisDTO[] = $derived(
		userMessages.map((msg) => msg.analysis).filter((f) => f !== null)
	);
</script>

<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0 mr-2">
	<PerformanceScores {userMessages} {analyses} />

	<MetricsOverTime {userMessages} />

	<MistakesSeverity {analyses} />
</ScrollableWrapper>
