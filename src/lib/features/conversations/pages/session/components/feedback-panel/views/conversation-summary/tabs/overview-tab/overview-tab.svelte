<script lang="ts">
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import { MessageStatistics, MistakesSeverity, PerformanceScores } from './sections';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type {
		CompactConversationAiMessage,
		CompactConversationUserMessage
	} from '$lib/types/conversation/domain/conversation-message';

	const messagesContext = getMessagesContext();

	const messages = $derived(messagesContext.messages);

	const userMessages: CompactConversationUserMessage[] = $derived(
		messages.filter((msg) => msg.sender === 'USER')
	);
	const aiMessages: CompactConversationAiMessage[] = $derived(
		messages.filter((msg) => msg.sender === 'AI')
	);
	const feedbacks: ConversationUserMessageFeedbackDTO[] = $derived(
		userMessages.map((msg) => msg.feedback).filter((f) => f !== null)
	);
</script>

<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
	<MessageStatistics {userMessages} {aiMessages} />

	<PerformanceScores {userMessages} {feedbacks} />

	<MistakesSeverity {feedbacks} />
</ScrollableWrapper>
