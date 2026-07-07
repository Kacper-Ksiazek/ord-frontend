<script lang="ts">
	import MessageBase from '../message-base.svelte';
	import type { CompactConversationUserMessage } from '$conversations/types/domain/conversation-message';
	import { Analysis } from './components';
	import UserMessageTextContent from './lib/user-message-text-content.svelte';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	interface UserMessageProps {
		messageIndex: number;
		message: CompactConversationUserMessage;
	}

	const { messageIndex, message }: UserMessageProps = $props();

	let showIconsInHighlightedParts = $state(false);
</script>

<MessageBase dataTestId={E2E_TEST_IDS.session.userMessage(messageIndex)} orientation="right">
	{#snippet content()}
		<UserMessageTextContent
			{messageIndex}
			{showIconsInHighlightedParts}
			messageContent={message.content}
			analysis={message.analysis}
		/>
	{/snippet}

	{#snippet footer()}
		<Analysis analysis={message.analysis} {messageIndex} bind:showIconsInHighlightedParts />
	{/snippet}
</MessageBase>
