<script lang="ts">
	import { suggestConversationTopics } from '$lib/api-client/conversation/see/suggest-conversation-topics';
	import { AiActionButton } from '$lib/components/utils/ai-action-button';
	import type { AiActionButtonStatus } from '$lib/components/utils/ai-action-button/ai-action-button.types';
	import { Input } from 'flowbite-svelte';
	import { getCreateConversationPayload } from '$lib/components/features/conversation/create/stores/create-conversation-payload.svelte';
	import { topics } from '../topic-picker.store.svelte';

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
				clueFromUser: clueForGeneration || undefined
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

<div class="flex items-center gap-2">
	<AiActionButton status={generateButtonStatus} onclick={generateTopics} />

	<Input
		placeholder="Give me a hint or idea to inspire your topics... (optional)"
		class="flex-1"
		bind:value={clueForGeneration}
	/>
</div>
