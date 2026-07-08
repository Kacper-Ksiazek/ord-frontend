import isEmpty from 'lodash/isEmpty';
import { onMount } from 'svelte';
import { SvelteDate } from 'svelte/reactivity';
import { page } from '$app/state';
import { initializeConversationByAI } from '$conversations/api-client/ongoing-conversation/sse/initialize-conversation-by-ai';
import { createRequestLearningTipsForAIMessageMutation } from '$conversations/api-client/ongoing-conversation/mutations/use-request-learning-tips-for-ai-message';
import type { CompactConversationAiMessage } from '$conversations/types';
import { getConversationContext } from '../contexts/conversation-context.svelte';
import { getMessagesContext } from '../contexts/messages-context.svelte';

export function useInitializeConversation() {
	const messagesContext = getMessagesContext();
	const conversation = getConversationContext();
	const { mutateAsync: requestLearningTipsMutation } =
		createRequestLearningTipsForAIMessageMutation();

	onMount(() => {
		if (isEmpty(messagesContext.messages)) {
			messagesContext.isGeneratingAiMessage = true;
			messagesContext.messages.push({
				sender: 'AI',
				content: '',
				createdAt: new SvelteDate().toISOString()
			});

			initializeConversationByAI(page.params.id).subscribe({
				next: (data) => {
					messagesContext.messages[0].content += data;
				},
				complete: () => {
					messagesContext.isGeneratingAiMessage = false;
					const aiMessage = messagesContext.messages[0] as CompactConversationAiMessage;
					if (!aiMessage.learningTips) {
						messagesContext.isGeneratingLearningTips = true;
						requestLearningTipsMutation({
							conversationId: conversation.id
						})
							.then((learningTips) => {
								aiMessage.learningTips = learningTips;
							})
							.catch((error) => {
								console.error('Failed to fetch learning tips:', error);
							})
							.finally(() => {
								messagesContext.isGeneratingLearningTips = false;
							});
					}
				},
				error: () => {
					messagesContext.isGeneratingAiMessage = false;
				}
			});
		}
	});
}
