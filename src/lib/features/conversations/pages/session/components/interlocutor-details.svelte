<script lang="ts">
	import type {
		ConversationAIInterlocutorAvatarId,
		ConversationDTO
	} from '$lib/types/conversation/domain/conversation';
	import AiInterlocutorAvatar from '$lib/features/conversations/shared/components/ai-interlocutor-avatar.svelte';

	interface InterlocutorDetailsProps {
		conversation: ConversationDTO;
	}

	const { conversation }: InterlocutorDetailsProps = $props();
</script>

<div class="flex flex-col items-center mb-8">
	<div class="w-[144px] aspect-square">
		<AiInterlocutorAvatar
			avatarId={conversation.aiInterlocutorAvatarId as ConversationAIInterlocutorAvatarId}
			size="fullsize"
			class="rounded-full"
		/>
	</div>

	<h3 class="text-2xl font-bold">{conversation.aiInterlocutorName}</h3>

	<span class="border-b border-gray-200 dark:border-gray-700 w-[128px] my-2"></span>

	<span class="text-gray-500 dark:text-gray-400">
		<span>{conversation.topic}</span>
	</span>
</div>
