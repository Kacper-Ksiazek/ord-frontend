<script lang="ts">
	import { ConversationTypeCard } from './components';
	import { conversationTypes } from './conversation-types.constants';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '../../stores/create-conversation-payload.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const selectedType = $derived(getCreateConversationPayload());

	const getTypeLabel = (type: string) => {
		const typeKey = type.toLowerCase().replace(/_/g, '_');
		const messageKey = `features.conversation.create.step-1.types.${typeKey}.label` as keyof typeof m;
		const messageFn = m[messageKey] as (() => string) | undefined;
		return messageFn?.() || type;
	};

	const getTypeDescription = (type: string) => {
		const typeKey = type.toLowerCase().replace(/_/g, '_');
		const messageKey =
			`features.conversation.create.step-1.types.${typeKey}.description` as keyof typeof m;
		const messageFn = m[messageKey] as (() => string) | undefined;
		return messageFn?.() || '';
	};
</script>

<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
	{m['features.conversation.create.step-1.description']()}
</p>

<section class="flex flex-wrap gap-4 justify-center">
	{#each conversationTypes as { type }}
		{@const isSelected = selectedType.type === type}
		{@const label = getTypeLabel(type)}
		{@const description = getTypeDescription(type)}

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
