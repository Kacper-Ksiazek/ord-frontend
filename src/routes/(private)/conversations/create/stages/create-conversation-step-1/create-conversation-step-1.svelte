<script lang="ts">
import type { ConversationType as ConversationTypeType } from '$lib/types/conversation/domain/conversation';
import ConversationTypeCard from './components/conversation-type-card.svelte';
import { conversationTypes } from './create-conversation-step-1.constants';

type CreateConversationStep1Props = {
	onSelectType: (type: ConversationTypeType) => void;
	selectedType: ConversationTypeType | undefined;
};

const { onSelectType, selectedType }: CreateConversationStep1Props = $props();
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
<section></section>
