<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import type { ConversationAITone } from '$lib/types/conversation/domain/conversation';

	type ToneCardProps = {
		isSelected: boolean;
		tone: ConversationAITone;
		label: string;
		description: string;
		onclick: () => void;
	};

	const { onclick, isSelected, tone, label, description }: ToneCardProps = $props();

	const enableHints = true;
</script>

<SelectableCard {onclick} {isSelected} class="w-[378px] py-10 px-4">
	<div
		class={cn(
			'w-20 h-20 rounded-full mb-2 flex items-center justify-center text-2xl font-bold transition-colors',
			isSelected
				? 'bg-primary-500 text-white dark:bg-primary-600'
				: 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
		)}
	>
		{#if tone === 'FRIENDLY'}
			😊
		{:else if tone === 'FORMAL'}
			👔
		{:else if tone === 'HUMOROUS'}
			😄
		{:else if tone === 'NEUTRAL'}
			😐
		{:else if tone === 'ENCOURAGING'}
			💪
		{:else if tone === 'CHALLENGING'}
			🎯
		{/if}
	</div>

	<h3 class="text-lg font-bold text-gray-900 dark:text-gray-50">
		{label}
	</h3>

	{#if enableHints}
		<p
			class={cn(
				'text-sm text-center dark:text-gray-400',
				isSelected && 'text-gray-600 dark:text-gray-100'
			)}
		>
			{description}
		</p>
	{/if}
</SelectableCard>
