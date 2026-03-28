<script lang="ts">
	import {
		AnalysisPanel,
		MessagesPanel
	} from '$lib/features/conversations/pages/session/components';
	import { onMount } from 'svelte';
	import isEmpty from 'lodash/isEmpty';
	import { getMessagesContext } from '$lib/features/conversations/pages/session/contexts/messages-context.svelte';
	import { getConversationContext } from '$lib/features/conversations/pages/session/contexts/conversation-context.svelte';
	import { initializeConversationByAI } from '$lib/api-client/ongoing-conversation/sse/initialize-conversation-by-ai';
	import { createRequestLearningTipsForAIMessageMutation } from '$lib/api-client/ongoing-conversation/mutations/use-request-learning-tips-for-ai-message';
	import type { CompactConversationAiMessage } from '$lib/types/conversation/domain/conversation-message';
	import { page } from '$app/state';

	onMount(() => {
		const messagesContext = getMessagesContext();
		const conversation = getConversationContext();
		const { mutateAsync: requestLearningTipsMutation } =
			createRequestLearningTipsForAIMessageMutation();

		if (isEmpty(messagesContext.messages)) {
			messagesContext.isGenerating = true;
			messagesContext.messages.push({
				sender: 'AI',
				content: '',
				createdAt: new Date().toISOString()
			});

			initializeConversationByAI(page.params.id).subscribe({
				next: (data) => {
					messagesContext.messages[0].content += data;
				},
				complete: () => {
					messagesContext.isGenerating = false;
					// Check if message already has learning tips from backend
					const aiMessage = messagesContext.messages[0] as CompactConversationAiMessage;
					if (!aiMessage.learningTips) {
						// Automatically fetch learning tips for the initial AI message
						requestLearningTipsMutation({
							conversationId: conversation.id
						})
							.then((learningTips) => {
								aiMessage.learningTips = learningTips;
							})
							.catch((error) => {
								console.error('Failed to fetch learning tips:', error);
							});
					}
				},
				error: () => {
					messagesContext.isGenerating = false;
				}
			});
		}
	});
</script>

<div class="w-full flex-1 mx-auto flex h-full justify-between">
	<MessagesPanel />

	<AnalysisPanel />
</div>
