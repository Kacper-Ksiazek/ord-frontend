<script lang="ts">
	import MessageBase from '../message-base.svelte';
	import type { CompactConversationUserMessage } from '$conversations/types';
	import { Analysis } from './components';
	import UserMessageTextContent from './lib/user-message-text-content.svelte';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';
	import { createRequestAnalysisForUserMessageMutation } from '$conversations/api-client';
	import { getConversationContext } from '$conversations/pages/session/contexts/conversation-context.svelte';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import { findLatestAiMessageContent } from '$conversations/pages/session/services/message-helpers';
	import type { ConversationUserMessageAnalysisDTO } from '$conversations/types';

	interface UserMessageProps {
		messageIndex: number;
		message: CompactConversationUserMessage;
	}

	const { messageIndex, message }: UserMessageProps = $props();

	let showIconsInHighlightedParts = $state(false);

	const conversation = getConversationContext();
	const messagesContext = getMessagesContext();
	const { mutateAsync: requestAnalysisMutation } = createRequestAnalysisForUserMessageMutation();

	async function retryAnalysis() {
		if (!message.messageId) {
			return;
		}

		message.analysisFailed = false;
		messagesContext.isGeneratingUserMessageAnalysis = true;

		try {
			const data = await requestAnalysisMutation({
				conversationId: conversation.id,
				messageId: message.messageId,
				messageOrder: messageIndex,
				latestAIMessage: findLatestAiMessageContent(messagesContext.messages, messageIndex)
			});
			message.analysis = data as ConversationUserMessageAnalysisDTO;
			message.analysisFailed = false;
		} catch (error) {
			console.error('Failed to fetch user message analysis:', error);
			message.analysisFailed = true;
		} finally {
			messagesContext.isGeneratingUserMessageAnalysis = false;
		}
	}
</script>

<MessageBase dataTestId={E2E_TEST_IDS.session.userMessage(messageIndex)} orientation="right">
	{#snippet content()}
		<UserMessageTextContent
			{messageIndex}
			{showIconsInHighlightedParts}
			messageContent={message.content}
			analysis={message.analysis}
		/>
	{/snippet}

	{#snippet footer()}
		<Analysis
			analysis={message.analysis}
			analysisFailed={message.analysisFailed ?? false}
			{messageIndex}
			bind:showIconsInHighlightedParts
			onRetryAnalysis={message.messageId
				? () => {
						void retryAnalysis();
					}
				: undefined}
		/>
	{/snippet}
</MessageBase>
