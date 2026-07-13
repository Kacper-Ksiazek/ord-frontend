import isEmpty from 'lodash/isEmpty';
import type { Subscription } from 'rxjs';
import { onDestroy, onMount } from 'svelte';
import { page } from '$app/state';
import { httpInitializeConversationByAI } from '$conversations/api-client/ongoing-conversation/sse/http-initialize-conversation-by-ai';
import { createRequestLearningTipsForAIMessageMutation } from '$conversations/api-client';
import type { CompactConversationAiMessage } from '$conversations/types';
import { getConversationContext } from '../contexts/conversation-context.svelte';
import { getMessagesContext } from '../contexts/messages-context.svelte';

export function useInitializeConversation() {
	const messagesContext = getMessagesContext();
	const conversation = getConversationContext();
	const { mutateAsync: requestLearningTipsMutation } =
		createRequestLearningTipsForAIMessageMutation();

	let aiInitSubscription: Subscription | undefined;

	onMount(() => {
		if (isEmpty(messagesContext.messages)) {
			messagesContext.isGeneratingAiMessage = true;
			messagesContext.messages.push({
				sender: 'AI',
				content: '',
				// eslint-disable-next-line svelte/prefer-svelte-reactivity -- one-shot timestamp in onMount
				createdAt: new Date().toISOString()
			});

			aiInitSubscription = httpInitializeConversationByAI(page.params.id).subscribe({
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

	onDestroy(() => {
		aiInitSubscription?.unsubscribe();
	});
}
