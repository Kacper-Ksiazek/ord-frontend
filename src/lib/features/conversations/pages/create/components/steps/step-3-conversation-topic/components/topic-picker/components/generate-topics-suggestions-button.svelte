<script lang="ts">
	import { suggestConversationTopics } from '$conversations/api-client/conversation/sse/suggest-conversation-topics';
	import { AiActionButton } from '$lib/components/buttons/ai-action-button';
	import type { AiActionButtonStatus } from '$lib/components/buttons/ai-action-button/ai-action-button.types';
	import { Input } from '$lib/components/forms/input';
	import { getCreateConversationPayload } from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import { topicPickerStore } from '../topic-picker.store.svelte';
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

		if (!conversationType) {
			return;
		}

		amountOfSkeletons = 3;
		generateButtonStatus = 'loading';

		return new Promise((resolve, reject) => {
			suggestConversationTopics({
				conversationType,
				language: payload.language,
				clueFromUser: clueForGeneration || undefined,
				excludeTopics: topicPickerStore.getAllTopics(conversationType)
			}).subscribe({
				next: (topic) => {
					if (topic?.value) {
						amountOfSkeletons = Math.max(0, amountOfSkeletons - 1);

						topicPickerStore.appendUnpinnedTopic(conversationType, topic.value);
						onStreamChunkReceive?.();
					} else {
						console.error('Topic is not a string');
						console.error(topic, typeof topic);
					}
				},
				error: () => {
					generateButtonStatus = 'failed';
					reject(new Error('Failed to generate topics'));
				},
				complete: () => {
					generateButtonStatus = 'success';
					resolve(true);
				}
			});
		});
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
