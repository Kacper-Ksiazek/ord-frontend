<script lang="ts">
	import {
		FeedbackPanel,
		MessagesPanel
	} from '$lib/features/conversations/pages/session/components';
	import { onDestroy, onMount } from 'svelte';
	import isEmpty from 'lodash/isEmpty';
	import { getMessagesContext } from '$lib/features/conversations/pages/session/contexts/messages-context.svelte';
	import { getConversationContext } from '$lib/features/conversations/pages/session/contexts/conversation-context.svelte';
	import { initializeConversationByAI } from '$lib/api-client/ongoing-conversation/sse/initialize-conversation-by-ai';
	import { createRequestLearningTipsForAIMessageMutation } from '$lib/api-client/ongoing-conversation/mutations/use-request-learning-tips-for-ai-message';
	import type { CompactConversationAiMessage } from '$conversations/types/domain/conversation-message';
	import { page } from '$app/state';
	import { stopSpeaking } from '$lib/utils/speak-text';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

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
				createdAt: new Date().toISOString()
			});

			initializeConversationByAI(page.params.id).subscribe({
				next: (data) => {
					messagesContext.messages[0].content += data;
				},
				complete: () => {
					messagesContext.isGeneratingAiMessage = false;
					// Check if message already has learning tips from backend
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
		stopSpeaking();
	});
</script>

<div
	class="w-full flex-1 mx-auto flex h-full justify-between"
	data-testid={E2E_TEST_IDS.session.page}
>
	<MessagesPanel />

	<FeedbackPanel />
</div>
