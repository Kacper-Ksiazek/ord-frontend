<script lang="ts">
	import AiInterlocutorAvatar from '$conversations/shared/components/ai-interlocutor-avatar.svelte';
	import type { ConversationAIInterlocutorAvatarId } from '$conversations/types';
	import { getConversationContext } from '$conversations/pages/session/contexts/conversation-context.svelte';

	const conversation = getConversationContext();
</script>

<AiInterlocutorAvatar
	avatarId={conversation.interlocutor.avatarId as ConversationAIInterlocutorAvatarId}
	size="fullsize"
	class="h-12 w-12 shrink-0 rounded-full object-cover"
/>
