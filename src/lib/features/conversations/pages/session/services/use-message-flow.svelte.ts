import type { Subscription } from 'rxjs';
import { onDestroy } from 'svelte';
import {
	createRequestAnalysisForUserMessageMutation,
	createRequestLearningTipsForAIMessageMutation,
	createSaveUserMessageMutation
} from '$conversations/api-client';
import { httpPostRequestAIMessage } from '$conversations/api-client/ongoing-conversation/sse/http-post-request-ai-message';
import type {
	CompactConversationAiMessage,
	CompactConversationUserMessage,
	ConversationUserMessageAnalysisDTO
} from '$conversations/types';
import { getConversationContext } from '../contexts/conversation-context.svelte';
import { getMessagesContext } from '../contexts/messages-context.svelte';
import {
	findLatestAiMessageContent,
	findLatestAiMessageIndex,
	removeEmptyAiMessageAt
} from './message-helpers';

export function useMessageFlow() {
	const conversation = getConversationContext();
	const messagesContext = getMessagesContext();

	const { mutateAsync: saveUserMessageMutation } = createSaveUserMessageMutation();
	const { mutateAsync: requestAnalysisMutation } = createRequestAnalysisForUserMessageMutation();
	const { mutateAsync: requestLearningTipsMutation } =
		createRequestLearningTipsForAIMessageMutation();

	/** True only while the user message is being persisted — not for the full AI SSE pipeline. */
	let isSaving = $state(false);
	let aiMessageSubscription: Subscription | undefined;

	onDestroy(() => {
		aiMessageSubscription?.unsubscribe();
	});

	async function requestAnalysisForMessage(
		messageOrder: number,
		messageId: string,
		latestAIMessage: string
	): Promise<void> {
		const userMessage = messagesContext.messages[messageOrder] as CompactConversationUserMessage;
		userMessage.analysisFailed = false;
		messagesContext.isGeneratingUserMessageAnalysis = true;

		try {
			const data = await requestAnalysisMutation({
				conversationId: conversation.id,
				messageId,
				messageOrder,
				latestAIMessage
			});
			userMessage.analysis = data as ConversationUserMessageAnalysisDTO;
			userMessage.analysisFailed = false;
		} catch (error) {
			console.error('Failed to fetch user message analysis:', error);
			userMessage.analysisFailed = true;
		} finally {
			messagesContext.isGeneratingUserMessageAnalysis = false;
		}
	}

	async function sendUserMessage(content: string): Promise<boolean> {
		if (!content.trim() || isSaving || messagesContext.isGeneratingAiMessage) {
			return false;
		}

		isSaving = true;
		messagesContext.aiStreamError = null;

		try {
			const messageId = crypto.randomUUID();
			const messageOrder = messagesContext.messages.length;

			messagesContext.messages.push({
				sender: 'USER',
				content,
				analysis: null,
				analysisFailed: false,
				messageId,
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

			void requestAnalysisForMessage(
				messageOrder,
				messageId,
				findLatestAiMessageContent(messagesContext.messages, messageOrder)
			);

			messagesContext.isGeneratingAiMessage = true;
			messagesContext.messages.push({
				sender: 'AI',
				content: '',
				// eslint-disable-next-line svelte/prefer-svelte-reactivity -- one-shot timestamp when sending
				createdAt: new Date().toISOString()
			});
			const aiMessageOrder = findLatestAiMessageIndex(messagesContext.messages);

			aiMessageSubscription?.unsubscribe();
			aiMessageSubscription = httpPostRequestAIMessage({
				conversationId: conversation.id,
				latestUserMessage: content,
				messageOrder: aiMessageOrder
			}).subscribe({
				next: (data) => {
					const aiIndex = findLatestAiMessageIndex(messagesContext.messages);
					if (aiIndex >= 0) {
						messagesContext.messages[aiIndex].content += data;
					}
				},
				complete: () => {
					messagesContext.isGeneratingAiMessage = false;
					messagesContext.isGeneratingLearningTips = true;

					const aiIndex = findLatestAiMessageIndex(messagesContext.messages);
					if (aiIndex < 0) {
						messagesContext.isGeneratingLearningTips = false;

						return;
					}

					requestLearningTipsMutation({
						conversationId: conversation.id
					})
						.then((learningTips) => {
							(messagesContext.messages[aiIndex] as CompactConversationAiMessage).learningTips =
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
					const aiIndex = findLatestAiMessageIndex(messagesContext.messages);
					if (aiIndex >= 0) {
						removeEmptyAiMessageAt(messagesContext.messages, aiIndex);
					}
					messagesContext.aiStreamError = 'message';
				}
			});

			return true;
		} finally {
			isSaving = false;
		}
	}

	return {
		get isSaving() {
			return isSaving;
		},
		sendUserMessage
	};
}
