<script lang="ts">
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import { cn } from 'flowbite-svelte';
	import { CloseOutline } from 'flowbite-svelte-icons';

	interface TopicRowProps {
		topic: string;
		index: number;
		isSelected: boolean;
		onclick: () => void;
		onRemoveClick: () => void;
	}

	let { topic, index, isSelected, onclick, onRemoveClick }: TopicRowProps = $props();
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
				onRemoveClick();
			}}
		>
			<CloseOutline class="w-5 h-5" />
		</button>
	{/if}
</SelectableCard>
