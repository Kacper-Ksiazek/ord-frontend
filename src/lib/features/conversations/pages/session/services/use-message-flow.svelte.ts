import type { Subscription } from 'rxjs';
import { onDestroy } from 'svelte';
import {
	createRequestAnalysisForUserMessageMutation,
	createRequestLearningTipsForAIMessageMutation,
	createSaveUserMessageMutation
} from '$conversations/api-client';
import { httpRequestAIMessage } from '$conversations/api-client/ongoing-conversation/sse/http-request-ai-message';
import type {
	CompactConversationAiMessage,
	CompactConversationMessage,
	CompactConversationUserMessage,
	ConversationUserMessageAnalysisDTO
} from '$conversations/types';
import { getConversationContext } from '../contexts/conversation-context.svelte';
import { getMessagesContext } from '../contexts/messages-context.svelte';

function findLatestAiMessageContent(
	messages: CompactConversationMessage[],
	beforeIndex = messages.length
): string {
	for (let i = beforeIndex - 1; i >= 0; i--) {
		if (messages[i].sender === 'AI') {
			return messages[i].content;
		}
	}

	return '';
}

function removeEmptyAiMessageAt(messages: CompactConversationMessage[], index: number): void {
	const message = messages[index];
	if (message?.sender === 'AI' && !message.content) {
		messages.splice(index, 1);
	}
}

export function useMessageFlow() {
	const conversation = getConversationContext();
	const messagesContext = getMessagesContext();

	const { mutateAsync: saveUserMessageMutation } = createSaveUserMessageMutation();
	const { mutateAsync: requestAnalysisMutation } = createRequestAnalysisForUserMessageMutation();
	const { mutateAsync: requestLearningTipsMutation } =
		createRequestLearningTipsForAIMessageMutation();

	let pending = $state(false);
	let aiMessageSubscription: Subscription | undefined;

	onDestroy(() => {
		aiMessageSubscription?.unsubscribe();
	});

	async function sendUserMessage(content: string): Promise<boolean> {
		if (!content.trim() || pending) return false;

		pending = true;
		try {
			const messageId = crypto.randomUUID();
			const messageOrder = messagesContext.messages.length;

			messagesContext.messages.push({
				sender: 'USER',
				content,
				analysis: null,
				// eslint-disable-next-line svelte/prefer-svelte-reactivity -- one-shot timestamp when sending
				createdAt: new Date().toISOString()
			});

			try {
				await saveUserMessageMutation({
					conversationId: conversation.id,
					content,
					messageOrder,
					messageId
				});
			} catch (error) {
				messagesContext.messages.splice(messageOrder, 1);
				console.error('Failed to save user message:', error);

				return false;
			}

			messagesContext.isGeneratingUserMessageAnalysis = true;
			requestAnalysisMutation({
				conversationId: conversation.id,
				messageId,
				messageOrder,
				latestAIMessage: findLatestAiMessageContent(messagesContext.messages, messageOrder)
			})
				.then((data) => {
					(messagesContext.messages[messageOrder] as CompactConversationUserMessage).analysis =
						data as ConversationUserMessageAnalysisDTO;
				})
				.catch((error) => {
					console.error('Failed to fetch user message analysis:', error);
				})
				.finally(() => {
					messagesContext.isGeneratingUserMessageAnalysis = false;
				});

			const aiMessageOrder = messageOrder + 1;
			messagesContext.isGeneratingAiMessage = true;
			messagesContext.messages.push({
				sender: 'AI',
				content: '',
				// eslint-disable-next-line svelte/prefer-svelte-reactivity -- one-shot timestamp when sending
				createdAt: new Date().toISOString()
			});

			aiMessageSubscription?.unsubscribe();
			aiMessageSubscription = httpRequestAIMessage({
				conversationId: conversation.id,
				latestUserMessage: content,
				messageOrder: aiMessageOrder
			}).subscribe({
				next: (data) => {
					messagesContext.messages[aiMessageOrder].content += data;
				},
				complete: () => {
					messagesContext.isGeneratingAiMessage = false;
					messagesContext.isGeneratingLearningTips = true;

					requestLearningTipsMutation({
						conversationId: conversation.id
					})
						.then((learningTips) => {
							(messagesContext.messages[aiMessageOrder] as CompactConversationAiMessage).learningTips =
								learningTips;
						})
						.catch((error) => {
							console.error('Failed to fetch learning tips:', error);
						})
						.finally(() => {
							messagesContext.isGeneratingLearningTips = false;
						});
				},
				error: () => {
					messagesContext.isGeneratingAiMessage = false;
					removeEmptyAiMessageAt(messagesContext.messages, aiMessageOrder);
				}
			});

			return true;
		} finally {
			pending = false;
		}
	}

	return {
		get pending() {
			return pending;
		},
		sendUserMessage
	};
}
