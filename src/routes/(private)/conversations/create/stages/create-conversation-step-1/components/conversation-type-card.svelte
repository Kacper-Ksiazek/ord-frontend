<script lang="ts">
import clsx from 'clsx';
import ConversationType from '$lib/components/features/conversation/conversation-type.svelte';
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

<div
  class={clsx(
    "flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 w-[320px] hover:bg-primary-50 cursor-pointer rounded-xl hover:dark:bg-primary-900 py-8",
    isSelected && "bg-primary-200! dark:bg-primary-500!"
  )}
  role="button"
  tabindex="0"
  {onclick}
  onkeydown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      onclick();
    }
  }}
>
  <ConversationType
    conversationType={type}
    class={clsx("w-20 h-20 text-gray-300", isSelected && "text-primary-500")}
  />
  <h3 class="text-lg font-bold dark:text-gray-50 mb-2">{label}</h3>

  {#if enableHints}
    <p
      class={clsx(
        "text-sm text-gray-500 text-center",
        isSelected && "dark:text-gray-200"
      )}
    >
      {description}
    </p>
  {/if}
</div>
