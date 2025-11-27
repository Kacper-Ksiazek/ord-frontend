<script lang="ts">
	import _isEmpty from 'lodash/isEmpty';
	import { SvelteMap } from 'svelte/reactivity';
	import ConversationTypeIcon from '$lib/components/features/conversation/conversation-type-icon.svelte';
	import Skeleton from '$lib/components/utils/skeleton.svelte';
	import type { ConversationType } from '$lib/types/conversation/domain/conversation';
	import type { TopicPickerProps } from './topic-picker.types';
	import TopicRow from './components/topic-row.svelte';
	import GenerateTopicsSuggestionsButton from './components/generate-topics-suggestions-button.svelte';
	import CustomTopicManagement from './components/custom-topic-management.svelte';

	let { selectedType, language, selectedTopic = $bindable() }: TopicPickerProps = $props();

	let amountOfSkeletons = $state(0);

	const topics = new SvelteMap<ConversationType, string[]>([
		[
			'SMALL_TALK',
			[
				"What's your favorite way to spend a weekend?",
				'Have you seen any good movies lately?',
				'If you could travel anywhere, where would you go?'
			]
		]
	]);

	const currentTopics = $derived(selectedType ? topics.get(selectedType) || [] : []);

	function removeTopic(topicToRemove: string) {
		if (!selectedType) {
			return;
		}

		const currentTopicsList = topics.get(selectedType) || [];
		const updatedTopics = currentTopicsList.filter((topic) => topic !== topicToRemove);

		topics.set(selectedType, updatedTopics);
	}
</script>

<section class="flex flex-col gap-4 my-2 max-w-[800px]">
	<GenerateTopicsSuggestionsButton {language} {selectedType} {topics} bind:amountOfSkeletons />

	<div class="flex min-h-[152px] flex-col gap-4">
		{#if _isEmpty(currentTopics) && amountOfSkeletons === 0}
			<div
				class="w-full flex-1 bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center"
			>
				<ConversationTypeIcon
					conversationType={selectedType!}
					class="w-32 h-32 text-gray-300 dark:text-gray-600"
				/>
			</div>
		{/if}

		{#each currentTopics as topic, index}
			<TopicRow
				{topic}
				{index}
				isSelected={selectedTopic === topic}
				onclick={() => (selectedTopic = topic)}
				onRemoveClick={() => removeTopic(topic)}
			/>
		{/each}

		{#if amountOfSkeletons > 0}
			{#each Array.from({ length: amountOfSkeletons })}
				<Skeleton class="h-10" />
			{/each}
		{/if}
	</div>

	<CustomTopicManagement {selectedType} {topics} />
</section>
