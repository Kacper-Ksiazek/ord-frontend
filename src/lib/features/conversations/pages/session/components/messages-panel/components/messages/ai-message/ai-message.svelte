<script lang="ts">
	import AiInterlocutorAvatar from '$lib/features/conversations/shared/components/ai-interlocutor-avatar.svelte';
	import type { ConversationAIInterlocutorAvatarId } from '$lib/types/conversation/domain/conversation';
	import { cn } from 'flowbite-svelte';
	import MessageBase from '../message-base.svelte';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';
	import { getConversationContext } from '$lib/features/conversations/pages/session/contexts/conversation-context.svelte';

	interface AiMessageProps {
		message: string;
		isStillGenerating: boolean;
	}

	const { message, isStillGenerating }: AiMessageProps = $props();

	const { interlocutor } = getConversationContext();
</script>

<MessageBase
	messageClass={cn(
		isStillGenerating && 'generation-in-progress', //
		!isStillGenerating && 'bg-gray-50 text-gray-600'
	)}
>
	{#snippet avatar()}
		<AiInterlocutorAvatar
			avatarId={interlocutor.avatarId as ConversationAIInterlocutorAvatarId}
			size="fullsize"
			class="rounded-full shadow-md w-12 h-12"
		/>
	{/snippet}

	{#snippet content()}
		{#if message}
			<p>
				{message}
			</p>
		{:else}
			<TextWithThreeDotsAnimation text="Generowanie odpowiedzi" />
		{/if}
	{/snippet}
</MessageBase>
