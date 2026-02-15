<script lang="ts">
	import AiInterlocutorAvatar from '$conversations/shared/components/ai-interlocutor-avatar.svelte';
	import { getConversationContext } from '$lib/features/conversations/pages/session/contexts/conversation-context.svelte';

	const conversation = getConversationContext();
</script>

<div class="flex flex-col items-center">
	<div class="w-[144px] aspect-square mb-2">
		<AiInterlocutorAvatar
			avatarId={conversation.interlocutor.avatarId}
			size="fullsize"
			class="rounded-full"
		/>
	</div>

	<h3 class="heading-4">{conversation.interlocutor.name}</h3>
</div>
