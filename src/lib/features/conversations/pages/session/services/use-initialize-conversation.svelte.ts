import isEmpty from 'lodash/isEmpty';
import type { Subscription } from 'rxjs';
import { onDestroy, onMount } from 'svelte';
import { page } from '$app/state';
import { httpPostInitializeConversationByAI } from '$conversations/api-client/ongoing-conversation/sse/http-post-initialize-conversation-by-ai';
import { createRequestLearningTipsForAIMessageMutation } from '$conversations/api-client';
import type { CompactConversationAiMessage } from '$conversations/types';
import { getConversationContext } from '../contexts/conversation-context.svelte';
import { getMessagesContext } from '../contexts/messages-context.svelte';
import { findLatestAiMessageIndex, removeEmptyAiMessageAt } from './message-helpers';

export function useInitializeConversation() {
	const messagesContext = getMessagesContext();
	const conversation = getConversationContext();
	const { mutateAsync: requestLearningTipsMutation } =
		createRequestLearningTipsForAIMessageMutation();

	let aiInitSubscription: Subscription | undefined;

	onMount(() => {
		if (isEmpty(messagesContext.messages)) {
			messagesContext.isGeneratingAiMessage = true;
			messagesContext.aiStreamError = null;
			messagesContext.messages.push({
				sender: 'AI',
				content: '',
				// eslint-disable-next-line svelte/prefer-svelte-reactivity -- one-shot timestamp in onMount
				createdAt: new Date().toISOString()
			});

			aiInitSubscription = httpPostInitializeConversationByAI(page.params.id).subscribe({
				next: (data) => {
					const aiIndex = findLatestAiMessageIndex(messagesContext.messages);
					if (aiIndex >= 0) {
						messagesContext.messages[aiIndex].content += data;
					}
				},
				complete: () => {
					messagesContext.isGeneratingAiMessage = false;
					const aiIndex = findLatestAiMessageIndex(messagesContext.messages);
					if (aiIndex < 0) {
						return;
					}

					const aiMessage = messagesContext.messages[aiIndex] as CompactConversationAiMessage;
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
					const aiIndex = findLatestAiMessageIndex(messagesContext.messages);
					if (aiIndex >= 0) {
						removeEmptyAiMessageAt(messagesContext.messages, aiIndex);
					}
					messagesContext.aiStreamError = 'init';
				}
			});
		}
	});

	onDestroy(() => {
		aiInitSubscription?.unsubscribe();
	});
}
