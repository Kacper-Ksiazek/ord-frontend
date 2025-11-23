<script lang="ts">
import { Button } from 'flowbite-svelte';
import { suggestConversationTopics } from '$lib/api-client/conversation/see/suggest-conversation-topics';
import type { ConversationType as ConversationTypeType } from '$lib/types/conversation/domain/conversation';
import type { LanguageName } from '$lib/types/core/domain/languages';
import ConversationTypeCard from './components/conversation-type-card.svelte';
import { conversationTypes } from './create-conversation-step-1.constants';

type CreateConversationStep1Props = {
	onSelectType: (type: ConversationTypeType) => void;
	selectedType: ConversationTypeType | undefined;
	language: LanguageName | undefined;
};

const { onSelectType, selectedType, language }: CreateConversationStep1Props = $props();

function generateTopic() {
	if (!selectedType) {
		console.warn('Please select a conversation type first');
		return;
	}

	console.log('Generating topic...');

	const topic$ = suggestConversationTopics({
		conversationType: selectedType,
		language: language!
	});

	const subscription = topic$.subscribe({
		next: (topic) => {
			console.log('Received topic:', topic);
		},
		error: (error) => {
			console.error('Failed to generate topic:', error);
		},
		complete: () => {
			console.log('Topic generation complete');
		}
	});

	return () => {
		subscription.unsubscribe();
	};
}
</script>

<h1 class="text-2xl font-bold">New Conversation</h1>

<h2 class="text-lg font-bold">Select a conversation type</h2>
<section class="flex flex-wrap gap-4">
  {#each conversationTypes as { type, label, description }}
    {@const isSelected = selectedType === type}

    <ConversationTypeCard
      {type}
      {label}
      {description}
      {isSelected}
      onclick={() => onSelectType(type)}
    />
  {/each}
</section>

---

<h2 class="text-lg font-bold">Select conversation topic</h2>
<section>
  <Button onclick={generateTopic}>Generate Topic</Button>
</section>
