<script lang="ts">
	import type { ConversationAIInterlocutorAvatarId } from '$lib/types/conversation/domain/conversation';
	import AiInterlocutorAvatar from '$lib/features/conversations/shared/components/ai-interlocutor-avatar.svelte';
	import { getConversationContext } from '../../../contexts/conversation-context.svelte';

	const conversation = getConversationContext();
</script>

<div class="flex flex-col items-center mb-8">
	<div class="w-[144px] aspect-square mb-2">
		<AiInterlocutorAvatar
			avatarId={conversation.interlocutor.avatarId as ConversationAIInterlocutorAvatarId}
			size="fullsize"
			class="rounded-full"
		/>
	</div>

	<h3 class="text-xl font-bold">{conversation.interlocutor.name}</h3>

	<span class="border-b border-gray-200 dark:border-gray-700 w-[128px] my-2"></span>

	<span class="text-gray-500 dark:text-gray-400 text-sm text-center">
		<span>{conversation.topic}</span>
	</span>
</div>
