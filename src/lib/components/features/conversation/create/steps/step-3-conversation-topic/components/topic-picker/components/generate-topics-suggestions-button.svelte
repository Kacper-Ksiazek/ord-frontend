<script lang="ts">
	import { suggestConversationTopics } from '$lib/api-client/conversation/sse/suggest-conversation-topics';
	import { AiActionButton } from '$lib/components/utils/ai-action-button';
	import type { AiActionButtonStatus } from '$lib/components/utils/ai-action-button/ai-action-button.types';
	import { Input } from 'flowbite-svelte';
	import { getCreateConversationPayload } from '$lib/components/features/conversation/create/stores/create-conversation-payload.svelte';
	import { topics } from '../topic-picker.store.svelte';
	import * as m from '$lib/paraglide/messages.js';

	interface GenerateTopicsSuggestionsButtonProps {
		amountOfSkeletons: number;
	}

	let { amountOfSkeletons = $bindable() }: GenerateTopicsSuggestionsButtonProps = $props();

	let clueForGeneration = $state('');
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
				excludeTopics: topics.get(conversationType) || []
			}).subscribe({
				next: (topic) => {
					if (topic?.value) {
						amountOfSkeletons = Math.max(0, amountOfSkeletons - 1);

						topics.set(conversationType, [...(topics.get(conversationType) || []), topic.value]);
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
		<AiActionButton status={generateButtonStatus} onclick={generateTopics} />
	</div>

	<Input
		placeholder={m['features.conversation.create.step-3.topic_picker.generate_suggestions.button']()}
		class="flex-1"
		bind:value={clueForGeneration}
		disabled={generateButtonStatus === 'loading'}
	/>
</div>
