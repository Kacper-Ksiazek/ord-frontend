<script lang="ts">
	import ConversationTypeCard from './components/conversation-type-card.svelte';
	import { TopicPicker } from './components/topic-picker';
	import { GenerateAIInterlocutor } from './components/generate-ai-interlocutor';
	import { conversationTypes } from './create-conversation-step-1.constants';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload
	} from '../../stores/create-conversation-payload.svelte';

	let selectedType = $derived(getCreateConversationPayload().type);
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
			onclick={() => setCreateConversationPayload({ type })}
		/>
	{/each}
</section>

---

<h2 class="text-lg font-bold">Select conversation topic</h2>

<TopicPicker />

---

<h2 class="text-lg font-bold">Generate AI Interlocutor</h2>

<GenerateAIInterlocutor />
