<script lang="ts">
	import { suggestConversationTopics } from '$lib/api-client/conversation/see/suggest-conversation-topics';
	import { AiActionButton } from '$lib/components/utils/ai-action-button';
	import type { AiActionButtonStatus } from '$lib/components/utils/ai-action-button/ai-action-button.types';
	import type { ConversationType } from '$lib/types/conversation/domain/conversation';
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import { Input } from 'flowbite-svelte';
	import type { SvelteMap } from 'svelte/reactivity';

	interface GenerateTopicsSuggestionsButtonProps {
		language: LanguageName;
		selectedType: ConversationType | undefined;
		amountOfSkeletons: number;
		topics: SvelteMap<ConversationType, string[]>;
	}

	let {
		language,
		selectedType,
		amountOfSkeletons = $bindable(),
		topics = $bindable()
	}: GenerateTopicsSuggestionsButtonProps = $props();

	let clueForGeneration = $state('');
	let generateButtonStatus = $state<AiActionButtonStatus>('default');

	async function generateTopics() {
		if (!selectedType || !language) {
			return;
		}

		amountOfSkeletons = 3;

		generateButtonStatus = 'loading';

		return new Promise((resolve, reject) => {
			suggestConversationTopics({
				conversationType: selectedType,
				language: language,
				clueFromUser: clueForGeneration || undefined
			}).subscribe({
				next: (topic) => {
					if (topic?.value) {
						amountOfSkeletons = Math.max(0, amountOfSkeletons - 1);

						topics.set(selectedType, [...(topics.get(selectedType) || []), topic.value]);
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
