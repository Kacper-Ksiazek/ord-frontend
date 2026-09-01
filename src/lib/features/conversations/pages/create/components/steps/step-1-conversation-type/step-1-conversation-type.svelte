<script lang="ts">
	import { browser } from '$app/environment';
	import type { ConversationType } from '$conversations/types';
	import { ConversationTypeCard } from './components';
	import {
		CONVERSATION_TYPES,
		DISABLED_CONVERSATION_TYPES
	} from '$conversations/shared/constants/enum-values';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload,
		topicPickerStore
	} from '$conversations/pages/create/stores';
	import {
		clearDefaultConversationTypeFromStorage,
		readDefaultConversationTypeFromStorage,
		writeDefaultConversationTypeToStorage
	} from '$conversations/pages/create/utils/default-conversation-type-storage';
	import * as m from '$lib/paraglide/messages.js';
	import { getConversationTypeMessages } from '$conversations/shared/utils';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

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
				topicPickerStore.resetCustomState();
			}
		} else {
			writeDefaultConversationTypeToStorage(type);
			preferredType = type;

			const currentPayload = getCreateConversationPayload();

			if (currentPayload.type !== type) {
				setCreateConversationPayload({ type, topic: undefined });
				topicPickerStore.resetCustomState();
			} else {
				setCreateConversationPayload({ type });
			}
		}
	}
</script>

<div class="flex h-full min-h-0 flex-col overflow-y-auto">
	<p class="mb-4 shrink-0 text-sm text-gray-500 dark:text-gray-400">
		{m['features.conversation.create.step-1.description']()}
	</p>

	<section
		class="grid w-full grid-cols-2 gap-2 content-start sm:grid-cols-3 sm:gap-3"
		data-testid={E2E_TEST_IDS.createConversation.stepType}
	>
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
						topicPickerStore.resetCustomState();
					} else {
						setCreateConversationPayload({ type });
					}
				}}
			/>
		{/each}
	</section>
</div>
