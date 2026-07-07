<script lang="ts">
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import { MistakesSeverity, MetricsOverTime, PerformanceScores } from './sections';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import type { ConversationUserMessageAnalysisDTO } from '$conversations/types';
	import type { CompactConversationUserMessage } from '$conversations/types';

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
