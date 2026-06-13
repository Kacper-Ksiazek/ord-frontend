<script lang="ts">
	import { suggestConversationTopics } from '$lib/api-client/conversation/sse/suggest-conversation-topics';
	import { AiActionButton } from '$lib/components/actions/ai-action-button';
	import type { AiActionButtonStatus } from '$lib/components/actions/ai-action-button/ai-action-button.types';
	import { Input } from '$lib/components/forms/input';
	import { getCreateConversationPayload } from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import { appendUnpinnedTopic, getAllTopics, topicPickerUi } from '../topic-picker.store.svelte';
	import { TextQuote } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';

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
				excludeTopics: getAllTopics(conversationType)
			}).subscribe({
				next: (topic) => {
					if (topic?.value) {
						amountOfSkeletons = Math.max(0, amountOfSkeletons - 1);

						appendUnpinnedTopic(conversationType, topic.value);
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

<div class="flex items-center gap-3">
	<div class="shrink-0">
		<AiActionButton
			status={generateButtonStatus}
			onclick={generateTopics}
			disabled={topicPickerUi.useOwnTopic || !isClueForGenerationValid}
		/>
	</div>

	<Input
		placeholder={m['features.conversation.create.step-3.topic_picker.generate_suggestions.button']()}
		class="min-w-0 flex-1"
		leftAdornment={TextQuote}
		bind:value={clueForGeneration}
		disabled={generateButtonStatus === 'loading' || topicPickerUi.useOwnTopic}
		maxLength={128}
		bind:isValid={isClueForGenerationValid}
	/>
</div>
