<script lang="ts">
	import ContentCard from '$lib/components/utils/content-card.svelte';
	import type { ConversationDTO } from '$lib/types/conversation/domain/conversation';
	import { Button } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import ConversationTypeIcon from '$lib/features/conversations/shared/components/conversation-type-icon.svelte';
	import { getConversationTypeLabel } from '$lib/features/conversations/shared/utils';

	interface ConversationDetailsProps {
		conversation: ConversationDTO;
	}

	const { conversation }: ConversationDetailsProps = $props();
</script>

<ContentCard class="w-full flex items-start gap-2 ">
	<div class="flex items-center gap-2">
		<Button onclick={() => goto('/conversations')}>Back</Button>

		<ConversationTypeIcon conversationType={conversation.type} class="w-10 h-10" />
		<h2 class="text-lg">{getConversationTypeLabel(conversation.type)}</h2>
	</div>

	<h2 class="text-2xl font-bold">
		T:
		{conversation.topic}
	</h2>
</ContentCard>
