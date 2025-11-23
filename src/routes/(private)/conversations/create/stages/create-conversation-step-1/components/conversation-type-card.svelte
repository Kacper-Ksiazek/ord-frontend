<script lang="ts">
import { cn } from 'flowbite-svelte';
import ConversationType from '$lib/components/features/conversation/conversation-type.svelte';
import SelectableCard from '$lib/components/utils/selectable-card.svelte';
import type { ConversationType as ConversationTypeType } from '$lib/types/conversation/domain/conversation';

type ConversationTypeCardProps = {
	isSelected: boolean;
	type: ConversationTypeType;
	label: string;
	description: string;
	onclick: () => void;
};

const { onclick, isSelected, type, label, description }: ConversationTypeCardProps = $props();

const enableHints = true;
</script>

<SelectableCard {onclick} {isSelected} class="w-[320px] py-8 px-4">
  <ConversationType
    conversationType={type}
    class={cn(
      "w-20 h-20 text-gray-300 mb-2", //
      isSelected && "text-primary-500"
    )}
  />

  <h3 class="text-lg font-bold text-gray-900 dark:text-gray-50">
    {label}
  </h3>

  {#if enableHints}
    <p class="text-sm text-center">
      {description}
    </p>
  {/if}
</SelectableCard>
