<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import type { ConversationAITone } from '$lib/types/conversation/domain/conversation';
	import ConversationToneIcon from '$lib/features/conversations/shared/components/conversation-tone-icon.svelte';

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
	<ConversationToneIcon
		{tone}
		class={cn(
			'w-20 h-20 text-gray-300 mb-2 dark:text-gray-600',
			isSelected && 'text-primary-500 dark:text-white'
		)}
	/>

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
