<script lang="ts">
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import { cn } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';
	import { topics } from '../topic-picker.store.svelte';
	import { getCreateConversationPayload } from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';

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

<SelectableCard
	{onclick}
	class="flex-row gap-3 justify-start p-0 overflow-hidden h-12"
	{isSelected}
>
	<span
		class={cn(
			'flex items-center justify-center min-w-10 bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-semibold text-sm transition-all',
			isSelected && 'bg-primary-500! dark:bg-primary-500! text-white px-5'
		)}>{index + 1}</span
	>

	<span
		class={cn(
			'text-sm flex-1 py-3 px-2 font-medium', //
			isSelected && 'text-gray-900 dark:text-gray-50',
			!isSelected && 'text-gray-700 dark:text-gray-300'
		)}>{topic}</span
	>

	{#if !isSelected}
		<button
			class={cn(
				'cursor-pointer text-gray-400 dark:text-gray-500 p-2 mr-1 rounded-md transition-colors', //
				'hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 dark:hover:text-red-400'
			)}
			onclick={(e) => {
				e.stopPropagation();
				removeTopic(topic);
			}}
			aria-label="Remove topic"
		>
			<CloseOutline class="w-4 h-4" />
		</button>
	{/if}
</SelectableCard>
