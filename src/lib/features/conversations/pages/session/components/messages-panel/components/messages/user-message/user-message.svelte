<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import MessageBase from '../message-base.svelte';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import { Feedback } from './components';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';

	interface UserMessageProps {
		message: CompactConversationUserMessage;
	}

	const { message }: UserMessageProps = $props();
</script>

<MessageBase wrapperClass="self-end " messageClass={cn('bg-slate-200 text-gray-700 w-full')}>
	{#snippet content()}
		<div>
			<p>
				{message.content}
			</p>
		</div>
	{/snippet}

	{#snippet footer()}
		<div class="flex gap-4 items-center text-md mt-2 justify-between w-full">
			{#if message.feedback}
				<Feedback feedback={message.feedback} />
			{:else}
				<div class="w-full h-[32px] generation-in-progress px-4">
					<TextWithThreeDotsAnimation text="Ocenianie" />
				</div>
			{/if}
		</div>
	{/snippet}
</MessageBase>
