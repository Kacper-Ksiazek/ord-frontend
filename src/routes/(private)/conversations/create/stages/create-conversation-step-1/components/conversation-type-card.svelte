<script lang="ts">
import { cn } from 'flowbite-svelte';
import ConversationTypeIcon from '$lib/components/features/conversation/conversation-type-icon.svelte';
import SelectableCard from '$lib/components/utils/selectable-card.svelte';
import type { ConversationType } from '$lib/types/conversation/domain/conversation';

type ConversationTypeCardProps = {
	isSelected: boolean;
	type: ConversationType;
	label: string;
	description: string;
	onclick: () => void;
};

const { onclick, isSelected, type, label, description }: ConversationTypeCardProps = $props();

const enableHints = true;
</script>

<SelectableCard {onclick} {isSelected} class="w-[320px] py-8 px-4">
  <ConversationTypeIcon
    conversationType={type}
    class={cn(
      "w-20 h-20 text-gray-300 mb-2 dark:text-gray-600", //
      isSelected && "text-primary-500 dark:text-white"
    )}
  />

  <h3 class="text-lg font-bold text-gray-900 dark:text-gray-50">
    {label}
  </h3>

  {#if enableHints}
    <p
      class={cn(
        "text-sm text-center dark:text-gray-400",
        isSelected && "text-gray-600 dark:text-gray-100"
      )}
    >
      {description}
    </p>
  {/if}
</SelectableCard>
