import type { Subscription } from 'rxjs';
import { onDestroy } from 'svelte';
import { createSaveUserMessageMutation } from '$conversations/api-client/ongoing-conversation/mutations/use-save-user-message';
import { createRequestAnalysisForUserMessageMutation } from '$conversations/api-client/ongoing-conversation/mutations/use-request-analysis-for-user-message';
import { createRequestLearningTipsForAIMessageMutation } from '$conversations/api-client/ongoing-conversation/mutations/use-request-learning-tips-for-ai-message';
import { requestAIMessage } from '$conversations/api-client/ongoing-conversation/sse/request-ai-message';
import type {
	CompactConversationAiMessage,
	CompactConversationUserMessage,
	ConversationUserMessageAnalysisDTO
} from '$conversations/types';
import { getConversationContext } from '../contexts/conversation-context.svelte';
import { getMessagesContext } from '../contexts/messages-context.svelte';

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

			await saveUserMessageMutation({
				conversationId: conversation.id,
				content,
				messageOrder,
				messageId
			});

			messagesContext.isGeneratingUserMessageAnalysis = true;
			requestAnalysisMutation({
				conversationId: conversation.id,
				messageId,
				messageOrder,
				latestAIMessage: messagesContext.messages[messageOrder - 1].content
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
			aiMessageSubscription = requestAIMessage({
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
