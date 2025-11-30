<script lang="ts">
	import { ConversationTypeCard } from './components';
	import { conversationTypes } from './conversation-types.constants';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '../../stores/create-conversation-payload.svelte';

	const selectedType = $derived(getCreateConversationPayload());
</script>

<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
	Choose the type of conversation you'd like to practice. Each type offers a different learning
	experience.
</p>

<section class="flex flex-wrap gap-4 justify-center">
	{#each conversationTypes as { type, label, description }}
		{@const isSelected = selectedType.type === type}

		<ConversationTypeCard
			{type}
			{label}
			{description}
			{isSelected}
			onclick={() => {
				const currentPayload = getCreateConversationPayload();
				// Reset topic only if the type is actually changing
				if (currentPayload.type !== type) {
					setCreateConversationPayload({ type, topic: undefined });
				} else {
					setCreateConversationPayload({ type });
				}
			}}
		/>
	{/each}
</section>
