<script lang="ts">
	import { browser } from '$app/environment';
	import type { ConversationType } from '$lib/types/conversation/domain/conversation';
	import { ConversationTypeCard } from './components';
	import {
		CONVERSATION_TYPES,
		DISABLED_CONVERSATION_TYPES
	} from '$lib/features/conversations/shared/constants/enum_values';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import { resetTopicPickerCustomState } from '$lib/features/conversations/pages/create/components/steps/step-3-conversation-topic/components/topic-picker/topic-picker.store.svelte';
	import {
		clearDefaultConversationTypeFromStorage,
		readDefaultConversationTypeFromStorage,
		writeDefaultConversationTypeToStorage
	} from '$lib/features/conversations/pages/create/utils/default-conversation-type-storage';
	import * as m from '$lib/paraglide/messages.js';
	import { getConversationTypeMessages } from '$lib/features/conversations/shared/utils';

	const selectedType = $derived(getCreateConversationPayload());

	let preferredType = $state<ConversationType | null>(
		browser ? readDefaultConversationTypeFromStorage() : null
	);

	function handleToggleDefault(type: ConversationType) {
		if (preferredType === type) {
			clearDefaultConversationTypeFromStorage();
			preferredType = null;

			const currentPayload = getCreateConversationPayload();

			if (currentPayload.type === type) {
				setCreateConversationPayload({ type: undefined });
				resetTopicPickerCustomState();
			}
		} else {
			writeDefaultConversationTypeToStorage(type);
			preferredType = type;

			const currentPayload = getCreateConversationPayload();

			if (currentPayload.type !== type) {
				setCreateConversationPayload({ type, topic: undefined });
				resetTopicPickerCustomState();
			} else {
				setCreateConversationPayload({ type });
			}
		}
	}
</script>

<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
	{m['features.conversation.create.step-1.description']()}
</p>

<section class="flex flex-wrap gap-4 justify-center">
	{#each CONVERSATION_TYPES as type (type)}
		{@const isSelected = selectedType.type === type}
		{@const disabled = DISABLED_CONVERSATION_TYPES.has(type)}
		{@const { label, description } = getConversationTypeMessages(type)}

		<ConversationTypeCard
			{type}
			{label}
			{description}
			{disabled}
			{isSelected}
			isPreferredDefault={preferredType === type}
			onToggleDefault={disabled ? undefined : () => handleToggleDefault(type)}
			onclick={() => {
				const currentPayload = getCreateConversationPayload();
				// Reset topic only if the type is actually changing
				if (currentPayload.type !== type) {
					setCreateConversationPayload({ type, topic: undefined });
					resetTopicPickerCustomState();
				} else {
					setCreateConversationPayload({ type });
				}
			}}
		/>
	{/each}
</section>
