<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Heart } from 'lucide-svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { ConversationAITone } from '$conversations/types';
	import ConversationToneIcon from '$conversations/shared/components/conversation-tone-icon.svelte';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	type ToneCardProps = {
		isSelected: boolean;
		isPreferredDefault?: boolean;
		onToggleDefault?: () => void;
		tone: ConversationAITone;
		label: string;
		description: string;
		onclick: () => void;
	};

	const {
		onclick,
		isSelected,
		isPreferredDefault = false,
		onToggleDefault,
		tone,
		label,
		description
	}: ToneCardProps = $props();

	const enableHints = true;
</script>

<SelectableCard
	{onclick}
	{isSelected}
	data-testid={E2E_TEST_IDS.createConversation.toneCard(tone)}
	class={cn(
		'relative w-full min-w-0',
		'px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.75rem,2.5vh,1.75rem)]'
	)}
>
	{#if onToggleDefault}
		<IconButton
			icon={Heart}
			ariaLabel={isPreferredDefault
				? m['features.conversation.create.step-2.default_tone_star_aria_label_remove']()
				: m['features.conversation.create.step-2.default_tone_star_aria_label']()}
			tooltip={isPreferredDefault
				? m['features.conversation.create.step-2.default_tone_star_tooltip_remove']()
				: m['features.conversation.create.step-2.default_tone_star_tooltip']()}
			type="OUTLINED"
			variant="TEXT"
			class="absolute right-3 top-3 z-10 size-8 shrink-0 p-0"
			iconClass={cn(
				'size-4',
				isPreferredDefault && 'fill-rose-500 text-rose-500 dark:fill-rose-400 dark:text-rose-400'
			)}
			onClick={(e) => {
				e.stopPropagation();
				onToggleDefault();
			}}
		/>
	{/if}

	<ConversationToneIcon
		{tone}
		class={cn(
			'mb-1 size-[clamp(2.5rem,6vh,3.5rem)] text-gray-300 dark:text-gray-600',
			isSelected && 'text-primary-500 dark:text-white'
		)}
	/>

	<h3 class="text-base font-bold text-gray-900 dark:text-gray-50 sm:text-lg">
		{label}
	</h3>

	{#if enableHints}
		<p
			class={cn(
				'text-center text-xs leading-snug sm:text-sm dark:text-gray-400',
				isSelected && 'text-gray-600 dark:text-gray-100'
			)}
		>
			{description}
		</p>
	{/if}
</SelectableCard>
