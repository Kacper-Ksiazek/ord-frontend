<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import Textarea from './components/textarea.svelte';
	import SendButton from './components/send-button.svelte';
	import { createSaveUserMessageMutation } from '$lib/api-client/ongoing-conversation/mutations/use-save-user-message';
	import { getConversationContext } from '../../../../contexts/conversation-context.svelte';
	import { getMessagesContext } from '../../../../contexts/messages-context.svelte';
	import { requestAIMessage } from '$lib/api-client/ongoing-conversation/sse/request-ai-message';
	import { createRequestFeedbackForUserMessageMutation } from '$lib/api-client/ongoing-conversation/mutations/use-request-feedback-for-user-message';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';

	let message = $state('');
	let pending = $state(false);
	let textareaComponent: Textarea | undefined = $state();

	const conversation = getConversationContext();
	const messagesContext = getMessagesContext();

	const { mutateAsync: saveUserMessageMutation } = createSaveUserMessageMutation();
	const { mutateAsync: requestAIMessageMutation } = createRequestFeedbackForUserMessageMutation();

	async function saveUserMessage() {
		if (!message.trim() || pending) return;

		pending = true;
		try {
			const messageId = crypto.randomUUID();
			const messageOrder = messagesContext.messages.length;

			messagesContext.messages.push({
				sender: 'USER',
				content: message,
				feedback: null
			});

			await saveUserMessageMutation({
				conversationId: conversation.id,
				content: message,
				messageOrder,
				messageId
			});

			requestAIMessageMutation({
				conversationId: conversation.id,
				messageId,
				messageOrder,
				latestAIMessage: messagesContext.messages[messageOrder - 1].content
			}).then((data) => {
				(messagesContext.messages[messageOrder] as CompactConversationUserMessage).feedback =
					data as ConversationUserMessageFeedbackDTO;
			});

			const aiMessageOrder = messageOrder + 1;
			messagesContext.isGenerating = true;
			messagesContext.messages.push({
				sender: 'AI',
				content: ''
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
					messagesContext.isGenerating = false;
				},
				error: () => {
					messagesContext.isGenerating = false;
				}
			});

			// TODO: Implement actual message sending
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

<div class={cn('flex items-end gap-2 p-3 bg-white dark:bg-slate-800 rounded-2xl')}>
	<Textarea
		bind:this={textareaComponent}
		bind:value={message}
		placeholder="Type your message..."
		onkeydown={handleKeyDown}
	/>

	<SendButton disabled={!message.trim()} {pending} onclick={saveUserMessage} />
</div>
