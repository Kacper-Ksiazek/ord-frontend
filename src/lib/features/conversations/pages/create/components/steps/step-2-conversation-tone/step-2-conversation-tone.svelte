<script lang="ts">
	import { browser } from '$app/environment';
	import type { ConversationAITone } from '$conversations/types';
	import { ToneCard } from './components';
	import { CONVERSATION_TONES } from '$conversations/shared/constants/enum_values';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '$conversations/pages/create/stores/create-conversation-payload.svelte';
	import {
		clearDefaultConversationToneFromStorage,
		readDefaultConversationToneFromStorage,
		writeDefaultConversationToneToStorage
	} from '$conversations/pages/create/utils/default-conversation-tone-storage';
	import * as m from '$lib/paraglide/messages.js';
	import { getConversationToneMessages } from '$conversations/shared/utils';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	const selectedPayload = $derived(getCreateConversationPayload());

	let preferredTone = $state<ConversationAITone | null>(
		browser ? readDefaultConversationToneFromStorage() : null
	);

	function handleToggleDefault(tone: ConversationAITone) {
		if (preferredTone === tone) {
			clearDefaultConversationToneFromStorage();
			preferredTone = null;

			const currentPayload = getCreateConversationPayload();

			if (currentPayload.tone === tone) {
				setCreateConversationPayload({ tone: undefined });
			}
		} else {
			writeDefaultConversationToneToStorage(tone);
			preferredTone = tone;
			setCreateConversationPayload({ tone });
		}
	}
</script>

<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
	{m['features.conversation.create.step-2.description']()}
</p>

<section
	class="flex flex-wrap gap-4 justify-center"
	data-testid={E2E_TEST_IDS.createConversation.stepTone}
>
	{#each CONVERSATION_TONES as tone (tone)}
		{@const isSelected = selectedPayload.tone === tone}
		{@const { label, description } = getConversationToneMessages(tone)}

		<ToneCard
			{tone}
			{label}
			{description}
			{isSelected}
			isPreferredDefault={preferredTone === tone}
			onToggleDefault={() => handleToggleDefault(tone)}
			onclick={() => {
				setCreateConversationPayload({ tone });
			}}
		/>
	{/each}
</section>
