<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import MessageBase from '../message-base.svelte';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import { Feedback } from './components';
	import { highlightFeedbackContent } from './utils/highlight-feedback';
	// import AuthUserAvatar from '$lib/components/auth-user-avatar.svelte';

	interface UserMessageProps {
		message: CompactConversationUserMessage;
	}

	const { message }: UserMessageProps = $props();

	const highlightedContent = $derived(
		message.feedback ? highlightFeedbackContent(message.content, message.feedback) : message.content
	);
</script>

<MessageBase messageClass={cn('bg-slate-200 text-gray-700 w-full')} orientation="right">
	<!-- {#snippet avatar()}
		<AuthUserAvatar size={48} />
	{/snippet} -->

	{#snippet content()}
		<p>
			{@html highlightedContent}
		</p>
	{/snippet}

	{#snippet footer()}
		<div class="flex gap-4 items-center text-md mt-2 justify-between w-full pl-2">
			{#if message.feedback}
				<Feedback feedback={message.feedback} />
			{:else}
				<div class="w-full h-[184px] generation-in-progress px-4 rounded-md"></div>
			{/if}
		</div>
	{/snippet}
</MessageBase>
