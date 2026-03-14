<script lang="ts">
	import MessageBase from '../message-base.svelte';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import { Feedback } from './components';
	import UserMessageTextContent from './lib/user-message-text-content.svelte';

	interface UserMessageProps {
		messageIndex: number;
		message: CompactConversationUserMessage;
	}

	const { messageIndex, message }: UserMessageProps = $props();

	let showIconsInHighlightedParts = $state(false);
</script>

<MessageBase orientation="right">
	{#snippet content()}
		<UserMessageTextContent
			{messageIndex}
			{showIconsInHighlightedParts}
			messageContent={message.content}
			feedback={message.feedback}
		/>
	{/snippet}

	{#snippet footer()}
		<Feedback feedback={message.feedback} bind:showIconsInHighlightedParts />
	{/snippet}
</MessageBase>
