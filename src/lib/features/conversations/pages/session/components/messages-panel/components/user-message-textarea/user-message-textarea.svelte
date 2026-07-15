<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { AutoHeightTextarea } from '$lib/components/forms/auto-height-textarea';
	import SendButton from './components/send-button.svelte';
	import { getMessagesMaxWidth } from '../../../constants.svelte';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';
	import { useMessageFlow } from '../../../../services/use-message-flow.svelte';
	import { getMessagesContext } from '../../../../contexts/messages-context.svelte';
	import * as m from '$lib/paraglide/messages.js';

	let isFocused = $state(false);
	let message = $state('');
	let textareaComponent: AutoHeightTextarea | undefined = $state();

	const messageFlow = useMessageFlow();
	const messagesContext = getMessagesContext();
	const messagesMaxWidth = $derived(getMessagesMaxWidth());

	const isSendBlocked = $derived(messageFlow.isSaving || messagesContext.isGeneratingAiMessage);

	async function sendUserMessage() {
		const sent = await messageFlow.sendUserMessage(message);
		if (sent) {
			message = '';
			textareaComponent?.resetHeight();
		}
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			void sendUserMessage().catch((error) => {
				console.error('Failed to send user message:', error);
			});
		}
	}
</script>

<div
	data-testid={E2E_TEST_IDS.session.messageComposer}
	class={cn(
		'flex items-end gap-1 rounded-2xl w-full mb-2 px-2 py-1',
		messagesMaxWidth,
		'mx-auto',
		'border-2 border-gray-200 dark:border-gray-700',
		'bg-white dark:bg-slate-800',
		isFocused && 'border-primary-300 dark:border-primary-600'
	)}
>
	<AutoHeightTextarea
		bind:this={textareaComponent}
		dataTestId={E2E_TEST_IDS.session.messageInput}
		bind:value={message}
		placeholder={m['features.conversation.session.composer.placeholder']()}
		className="content-long "
		onkeydown={handleKeyDown}
		onfocus={() => (isFocused = true)}
		onblur={() => (isFocused = false)}
	/>

	<SendButton
		disabled={!message.trim() || isSendBlocked}
		pending={isSendBlocked}
		{isFocused}
		onclick={sendUserMessage}
	/>
</div>
