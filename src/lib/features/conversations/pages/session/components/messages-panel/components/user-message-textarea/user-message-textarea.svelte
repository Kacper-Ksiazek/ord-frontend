<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import Textarea from './components/textarea.svelte';
	import SendButton from './components/send-button.svelte';
	import { createSaveUserMessageMutation } from '$lib/api-client/ongoing-conversation/mutations/use-save-user-message';
	import { getConversationContext } from '../../../../contexts/conversation-context.svelte';
	import { getMessagesContext } from '../../../../contexts/messages-context.svelte';
	import { requestAIMessage } from '$lib/api-client/ongoing-conversation/sse/request-ai-message';
	import { createRequestAnalysisForUserMessageMutation } from '$lib/api-client/ongoing-conversation/mutations/use-request-analysis-for-user-message';
	import { createRequestLearningTipsForAIMessageMutation } from '$lib/api-client/ongoing-conversation/mutations/use-request-learning-tips-for-ai-message';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import type { ConversationUserMessageAnalysisDTO } from '$lib/types/conversation/domain/conversation-message-analysis';
	import type { CompactConversationAiMessage } from '$lib/types/conversation/domain/conversation-message';
	import { getMessagesMaxWidth } from '../../../constants.svelte';

	let isFocused = $state(false);
	let message = $state('');
	let pending = $state(false);
	let textareaComponent: Textarea | undefined = $state();

	const conversation = getConversationContext();
	const messagesContext = getMessagesContext();
	const messagesMaxWidth = $derived(getMessagesMaxWidth());

	const { mutateAsync: saveUserMessageMutation } = createSaveUserMessageMutation();
	const { mutateAsync: requestAIMessageMutation } = createRequestAnalysisForUserMessageMutation();
	const { mutateAsync: requestLearningTipsMutation } =
		createRequestLearningTipsForAIMessageMutation();

	async function saveUserMessage() {
		if (!message.trim() || pending) return;

		pending = true;
		try {
			const messageId = crypto.randomUUID();
			const messageOrder = messagesContext.messages.length;

			messagesContext.messages.push({
				sender: 'USER',
				content: message,
				analysis: null,
				createdAt: new Date().toISOString()
			});

			await saveUserMessageMutation({
				conversationId: conversation.id,
				content: message,
				messageOrder,
				messageId
			});

			messagesContext.isGeneratingUserMessageAnalysis = true;
			requestAIMessageMutation({
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
				createdAt: new Date().toISOString()
			});

			requestAIMessage({
				conversationId: conversation.id,
				latestUserMessage: message,
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

			message = '';
			textareaComponent?.resetHeight();
		} finally {
			pending = false;
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			saveUserMessage();
		}
	}
</script>

<div
	class={cn(
		'flex items-end gap-1 p-3 rounded-2xl w-full',
		messagesMaxWidth,
		'mx-auto mb-2',
		'border-2 border-gray-200 dark:border-gray-700',
		'bg-white dark:bg-slate-800',
		isFocused && 'border-primary-300 dark:border-primary-600'
	)}
>
	<Textarea
		bind:this={textareaComponent}
		bind:value={message}
		placeholder="Type your message..."
		className="content-long"
		onkeydown={handleKeyDown}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
	/>

	<SendButton disabled={!message.trim()} {pending} {isFocused} onclick={saveUserMessage} />
</div>
