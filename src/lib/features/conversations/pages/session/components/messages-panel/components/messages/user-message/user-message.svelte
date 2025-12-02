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

<MessageBase
	wrapperClass="self-end flex flex-col-reverse items-end w-full"
	messageClass={cn('bg-primary-400 text-gray-50 w-full')}
>
	{#snippet content()}
		<div>
			<p>
				{message.content}
			</p>
		</div>
	{/snippet}

	<div class="flex gap-4 items-center text-md mt-2 justify-between w-full">
		{#if message.feedback}
			<Feedback feedback={message.feedback} />
		{:else}
			<div class="w-full h-[32px] generation-in-progress px-4">
				<TextWithThreeDotsAnimation text="Ocenianie" />
			</div>
		{/if}
	</div>
</MessageBase>
