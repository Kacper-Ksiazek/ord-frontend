<script lang="ts">
	import AiInterlocutorAvatar from '$lib/features/conversations/shared/components/ai-interlocutor-avatar.svelte';
	import type {
		ConversationAIInterlocutorAvatarId,
		ConversationDTO
	} from '$lib/types/conversation/domain/conversation';
	import { cn } from 'flowbite-svelte';
	import MessageBase from '../message-base.svelte';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';

	interface AiMessageProps {
		message: string;
		isStillGenerating: boolean;
		interlocutor: Pick<ConversationDTO, 'aiInterlocutorAvatarId' | 'aiInterlocutorName'>;
	}

	const { message, isStillGenerating, interlocutor }: AiMessageProps = $props();
</script>

<MessageBase
	wrapperClass="gap-4 grid grid-cols-[48px_1fr] self-start"
	messageClass={cn(
		isStillGenerating && 'generation-in-progress', //
		!isStillGenerating && 'bg-slate-100'
	)}
>
	<div class="w-12 h-12">
		<AiInterlocutorAvatar
			avatarId={interlocutor.aiInterlocutorAvatarId as ConversationAIInterlocutorAvatarId}
			size="fullsize"
			class="rounded-full mt-4 shadow-sm"
		/>
	</div>

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
