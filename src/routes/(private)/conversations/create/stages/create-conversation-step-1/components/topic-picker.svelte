<script lang="ts">
import { Button, Input } from 'flowbite-svelte';
import _isEmpty from 'lodash/isEmpty';
import { SvelteMap } from 'svelte/reactivity';
import { suggestConversationTopics } from '$lib/api-client/conversation/see/suggest-conversation-topics';
import SelectableCard from '$lib/components/utils/selectable-card.svelte';
import Skeleton from '$lib/components/utils/skeleton.svelte';
import type { ConversationType } from '$lib/types/conversation/domain/conversation';
import type { LanguageName } from '$lib/types/core/domain/languages';

interface Props {
	selectedType: ConversationType | undefined;
	language: LanguageName | undefined;
}

const { selectedType, language }: Props = $props();

let amountOfSkeletons = $state(0);
let clueForGeneration = $state('');
const topics = new SvelteMap<ConversationType, string[]>();

const currentTopics = $derived(selectedType ? topics.get(selectedType) || [] : []);

function generateTopics() {
	if (!selectedType || !language) {
		return;
	}

	amountOfSkeletons = 3;

	suggestConversationTopics({
		conversationType: selectedType,
		language: language,
		clueFromUser: clueForGeneration
	}).subscribe({
		next: (topic) => {
			if (topic?.value) {
				amountOfSkeletons = Math.max(0, amountOfSkeletons - 1);

				topics.set(selectedType, [...(topics.get(selectedType) || []), topic.value]);
			} else {
				console.error('Topic is not a string');
				console.error(topic, typeof topic);
			}
		}
	});
}
</script>

<section class="flex flex-col gap-4 my-2 max-w-[800px]">
  <div class="flex items-center gap-2">
    <Button onclick={generateTopics} disabled={!selectedType || !language}>
      AI Generate
    </Button>

    <Input
      placeholder="Give me a hint or idea to inspire your topics... (optional)"
      class="flex-1"
      bind:value={clueForGeneration}
    />
  </div>

  {#if _isEmpty(currentTopics) && amountOfSkeletons === 0}
    {#each Array.from({ length: 3 })}
      <div class="w-full h-12 bg-gray-200 dark:bg-gray-800 rounded-md"></div>
    {/each}
  {/if}

  {#each currentTopics as topic}
    <SelectableCard onclick={() => {}}>
      <span class="text-center">{topic}</span>
    </SelectableCard>
  {/each}

  {#if amountOfSkeletons > 0}
    {#each Array.from({ length: amountOfSkeletons }) as _}
      <Skeleton class="h-12" />
    {/each}
  {/if}

  <Input placeholder="Enter a topic" />
  <Button>Add</Button>
</section>
