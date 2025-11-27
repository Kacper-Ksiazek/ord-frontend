<script lang="ts">
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import { cn } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import { topics } from '../topic-picker.store.svelte';
	import { getCreateConversationPayload } from '$lib/components/features/conversation/create/stores/create-conversation-payload.svelte';

	interface TopicRowProps {
		index: number;
		topic: string;
		isSelected: boolean;
		onclick: () => void;
	}

	const { index, topic, isSelected, onclick }: TopicRowProps = $props();

	function removeTopic(topicToRemove: string) {
		const payload = getCreateConversationPayload();
		if (!payload.type) {
			return;
		}

		const currentTopicsList = topics.get(payload.type) || [];
		const updatedTopics = currentTopicsList.filter((topic) => topic !== topicToRemove);

		topics.set(payload.type, updatedTopics);
	}
</script>

<SelectableCard {onclick} class="flex-row gap-4 justify-start p-0 overflow-hidden" {isSelected}>
	<span
		class={cn(
			'bg-gray-200 p-2 rounded-md text-gray-900 font-semibold h-full transition-all',
			'dark:text-gray-200 dark:bg-gray-700',
			isSelected && 'bg-primary-500! dark:bg-primary-500! text-white px-4'
		)}>{index + 1}.</span
	>

	<span
		class={cn(
			'text-sm flex-1 py-2', //
			isSelected && 'text-gray-900'
		)}>{topic}</span
	>

	{#if !isSelected}
		<button
			class={cn(
				'cursor-pointer text-gray-300 p-1 m-1', //
				'hover:text-red-300 hover:bg-red-50 rounded-full dark:hover:bg-transparent'
			)}
			onclick={(e) => {
				e.stopPropagation();
				removeTopic(topic);
			}}
		>
			<CloseOutline class="w-5 h-5" />
		</button>
	{/if}
</SelectableCard>
