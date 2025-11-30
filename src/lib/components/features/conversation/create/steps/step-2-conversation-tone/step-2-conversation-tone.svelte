<script lang="ts">
	import { ToneCard } from './components';
	import { conversationTones } from './conversation-tones.constants';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '../../stores/create-conversation-payload.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const selectedPayload = $derived(getCreateConversationPayload());

	const getToneLabel = (tone: string) => {
		const toneKey = tone.toLowerCase();
		const messageKey = `features.conversation.create.step-2.tones.${toneKey}.label` as keyof typeof m;
		const messageFn = m[messageKey] as (() => string) | undefined;
		return messageFn?.() || tone;
	};

	const getToneDescription = (tone: string) => {
		const toneKey = tone.toLowerCase();
		const messageKey =
			`features.conversation.create.step-2.tones.${toneKey}.description` as keyof typeof m;
		const messageFn = m[messageKey] as (() => string) | undefined;
		return messageFn?.() || '';
	};
</script>

<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">
	{m['features.conversation.create.step-2.description']()}
</p>

<section class="flex flex-wrap gap-4 justify-center">
	{#each conversationTones as { tone }}
		{@const isSelected = selectedPayload.tone === tone}
		{@const label = getToneLabel(tone)}
		{@const description = getToneDescription(tone)}

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
