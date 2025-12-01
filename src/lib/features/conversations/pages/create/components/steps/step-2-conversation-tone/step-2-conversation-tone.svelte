<script lang="ts">
	import { ToneCard } from './components';
	import { CONVERSATION_TONES } from '$lib/features/conversations/shared/constants/enum_values';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { getConversationToneMessages } from '$lib/features/conversations/shared/utils';

	const selectedPayload = $derived(getCreateConversationPayload());
</script>

<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
	{m['features.conversation.create.step-2.description']()}
</p>

<section class="flex flex-wrap gap-4 justify-center">
	{#each CONVERSATION_TONES as tone}
		{@const isSelected = selectedPayload.tone === tone}
		{@const { label, description } = getConversationToneMessages(tone)}

		<ToneCard
			{tone}
			{label}
			{description}
			{isSelected}
			onclick={() => {
				setCreateConversationPayload({ tone });
			}}
		/>
	{/each}
</section>
