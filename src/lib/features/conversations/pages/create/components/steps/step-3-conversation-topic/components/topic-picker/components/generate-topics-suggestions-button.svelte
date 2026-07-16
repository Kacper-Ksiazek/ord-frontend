<script lang="ts">
	import { AiActionButton } from '$lib/components/buttons/ai-action-button';
	import type { AiActionButtonStatus } from '$lib/components/buttons/ai-action-button/ai-action-button.types';
	import { Input } from '$lib/components/forms/input';
	import {
		getCreateConversationPayload,
		topicPickerStore
	} from '$conversations/pages/create/stores';
	import { suggestConversationTopics } from '$conversations/pages/create/services/suggest-conversation-topics';
	import { TextQuote } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	interface GenerateTopicsSuggestionsButtonProps {
		amountOfSkeletons: number;
		onStreamChunkReceive?: () => void;
	}

	let {
		amountOfSkeletons = $bindable(),
		onStreamChunkReceive
	}: GenerateTopicsSuggestionsButtonProps = $props();

	let clueForGeneration = $state('');
	let isClueForGenerationValid = $state<boolean>(true);
	let generateButtonStatus = $state<AiActionButtonStatus>('default');

	async function generateTopics() {
		const payload = getCreateConversationPayload();
		const conversationType = payload.type;

		if (!conversationType || !payload.language) {
			return;
		}

		amountOfSkeletons = 3;
		generateButtonStatus = 'loading';

		try {
			await suggestConversationTopics({
				conversationType,
				language: payload.language,
				clueFromUser: clueForGeneration || undefined,
				excludeTopics: topicPickerStore.getAllTopics(conversationType),
				onTopic: (topic) => {
					amountOfSkeletons = Math.max(0, amountOfSkeletons - 1);
					topicPickerStore.appendUnpinnedTopic(conversationType, topic);
					onStreamChunkReceive?.();
				}
			});
			generateButtonStatus = 'success';
		} catch {
			generateButtonStatus = 'failed';
		}
	}
</script>

<div
	class="flex items-center gap-3"
	data-testid={E2E_TEST_IDS.createConversation.topicGenerateButton}
>
	<div class="shrink-0">
		<AiActionButton
			status={generateButtonStatus}
			onclick={generateTopics}
			disabled={topicPickerStore.useOwnTopic || !isClueForGenerationValid}
		/>
	</div>

	<Input
		dataTestId={E2E_TEST_IDS.createConversation.topicGenerateClueInput}
		placeholder={m['features.conversation.create.step-3.topic_picker.generate_suggestions.button']()}
		class="min-w-0 flex-1"
		leftAdornment={TextQuote}
		bind:value={clueForGeneration}
		disabled={generateButtonStatus === 'loading' || topicPickerStore.useOwnTopic}
		maxLength={128}
		bind:isValid={isClueForGenerationValid}
	/>
</div>
