<script lang="ts">
	import type {
		ConversationAIInterlocutorAvatarId,
		ConversationDTO
	} from '$lib/types/conversation/domain/conversation';
	import ConversationTypeIcon from '$lib/features/conversations/shared/components/conversation-type-icon.svelte';
	import AiInterlocutorAvatar from '$lib/features/conversations/shared/components/ai-interlocutor-avatar.svelte';

	interface InterlocutorDetailsProps {
		conversation: ConversationDTO;
	}

	const { conversation }: InterlocutorDetailsProps = $props();
</script>

<div class="flex flex-col items-center">
	<div class="w-[96px] aspect-square">
		<AiInterlocutorAvatar
			avatarId={conversation.aiInterlocutorAvatarId as ConversationAIInterlocutorAvatarId}
			size="fullsize"
			class="rounded-full"
		/>
	</div>

	<h3 class="text-lg font-bold">{conversation.aiInterlocutorName}</h3>

	<span class="border-b border-gray-200 dark:border-gray-700 w-[128px] my-2"></span>

	<span class="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
		<ConversationTypeIcon conversationType={conversation.type} class="w-6 h-6" />
		{conversation.type}
	</span>

	<span class="text-sm text-gray-500 dark:text-gray-400">
		<strong>T:</strong>
		<span>{conversation.topic}</span>
	</span>
</div>
