<script lang="ts">
import clsx from 'clsx';
import demoImage from '$lib/assets/images/conversation/types/demo.png';
import type { ConversationType } from '$lib/types/conversation/domain/conversation';
import { conversationTypes } from './create-conversation-step-1.constants';

type CreateConversationStep1Props = {
	onSelectType: (type: ConversationType) => void;
	selectedType: ConversationType | undefined;
};

const { onSelectType, selectedType }: CreateConversationStep1Props = $props();

const enableHints = true;
</script>

<h1 class="text-2xl font-bold">New Conversation</h1>

<h2 class="text-lg font-bold">Select a conversation type</h2>
<section class="flex flex-wrap gap-4">
  {#each conversationTypes as { type, label, description }}
    {@const isSelected = selectedType === type}

    <div
      class={clsx(
        "flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 w-[320px] hover:bg-primary-50 cursor-pointer rounded-xl hover:dark:bg-primary-900 py-8",
        isSelected && "bg-primary-200! dark:bg-primary-500!"
      )}
      role="button"
      tabindex="0"
      onclick={() => onSelectType(type)}
      onkeydown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onSelectType(type);
        }
      }}
    >
      <img src={demoImage} alt={label} class="w-20 h-20" />
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
  {/each}
</section>

---

<h2 class="text-lg font-bold">Select conversation topic</h2>
<section></section>
