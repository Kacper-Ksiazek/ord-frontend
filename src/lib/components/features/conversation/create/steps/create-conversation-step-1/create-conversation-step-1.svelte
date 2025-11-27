<script lang="ts">
	import AIInterlocutorAvatar from '$lib/components/features/conversation/ai-interlocutor-avatar.svelte';
	import ConversationTypeCard from './components/conversation-type-card.svelte';
	import { TopicPicker } from './components/topic-picker';
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

<section>
	<div class="w-[512px] h-[512px]">
		<AIInterlocutorAvatar avatarId="AVATAR_ALPHA" size="fullsize" class="rounded-4xl" />
	</div>
</section>
