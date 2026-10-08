<script lang="ts">
	import { browser } from '$app/environment';
	import type { ConversationAITone } from '$conversations/types';
	import { ToneCard } from './components';
	import { CONVERSATION_TONES } from '$conversations/shared/constants/enum-values';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '$conversations/pages/create/stores';
	import {
		clearDefaultConversationToneFromStorage,
		readDefaultConversationToneFromStorage,
		writeDefaultConversationToneToStorage
	} from '$conversations/pages/create/utils/default-conversation-tone-storage';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { getConversationToneMessages } from '$conversations/shared/utils';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	const selectedPayload = $derived(getCreateConversationPayload());
	let compactView = $state(true);

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

<div class="flex h-full min-h-0 flex-col overflow-y-auto">
	<div class="mb-4 flex shrink-0 flex-wrap items-center justify-between gap-3">
		<p class="min-w-0 text-sm text-gray-500 dark:text-gray-400">
			{m['features.conversation.create.step-2.description']()}
		</p>

		<label class="inline-flex shrink-0 cursor-pointer items-center gap-2">
			<button
				type="button"
				role="switch"
				aria-checked={compactView}
				aria-label={m['features.conversation.create.step-2.compact_view_aria_label']()}
				class={cn(
					'inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border border-line p-0.5 transition-colors',
					compactView ? 'bg-ink' : 'bg-accent-soft'
				)}
				onclick={() => {
					compactView = !compactView;
				}}
			>
				<span
					class={cn(
						'block size-4 rounded-full bg-surface shadow-sm transition-transform',
						compactView && 'translate-x-4'
					)}
					aria-hidden="true"
				></span>
			</button>
			<span class="text-sm font-medium text-ink">
				{m['features.conversation.create.step-2.compact_view_label']()}
			</span>
		</label>
	</div>

	<section
		class="grid w-full grid-cols-2 gap-2 content-start sm:grid-cols-3 sm:gap-3"
		data-testid={E2E_TEST_IDS.createConversation.stepTone}
	>
		{#each CONVERSATION_TONES as tone (tone)}
			{@const isSelected = selectedPayload.tone === tone}
			{@const { label, description } = getConversationToneMessages(tone)}

			<ToneCard
				{tone}
				{label}
				{description}
				compact={compactView}
				{isSelected}
				isPreferredDefault={preferredTone === tone}
				onToggleDefault={() => handleToggleDefault(tone)}
				onclick={() => {
					setCreateConversationPayload({ tone });
				}}
			/>
		{/each}
	</section>
</div>
