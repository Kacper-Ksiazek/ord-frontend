<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { Heart } from 'lucide-svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { ConversationType } from '$lib/types/conversation/domain/conversation';
	import ConversationTypeIcon from '$lib/features/conversations/shared/components/conversation-type-icon.svelte';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	type ConversationTypeCardProps = {
		isSelected: boolean;
		disabled?: boolean;
		isPreferredDefault?: boolean;
		onToggleDefault?: () => void;
		type: ConversationType;
		label: string;
		description: string;
		onclick: () => void;
	};

	const {
		onclick,
		isSelected,
		disabled = false,
		isPreferredDefault = false,
		onToggleDefault,
		type,
		label,
		description
	}: ConversationTypeCardProps = $props();

	const enableHints = true;

	const comingSoonChipClass = cn(
		'pointer-events-none absolute right-3 top-3 label-small shrink-0 whitespace-nowrap rounded-md px-2.5 py-1',
		'border',
		'bg-white text-gray-900 border-gray-300',
		'dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600'
	);
</script>

<SelectableCard
	{onclick}
	{isSelected}
	{disabled}
	locked={disabled}
	data-testid={E2E_TEST_IDS.createConversation.typeCard(type)}
	class={cn('relative w-[378px] py-10 px-4')}
>
	{#if onToggleDefault}
		<IconButton
			icon={Heart}
			ariaLabel={isPreferredDefault
				? m['features.conversation.create.step-1.default_type_star_aria_label_remove']()
				: m['features.conversation.create.step-1.default_type_star_aria_label']()}
			tooltip={isPreferredDefault
				? m['features.conversation.create.step-1.default_type_star_tooltip_remove']()
				: m['features.conversation.create.step-1.default_type_star_tooltip']()}
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

	{#if disabled}
		<span class={comingSoonChipClass} role="status">
			{m['features.conversation.create.step-1.coming_soon_badge']()}
		</span>
	{/if}

	<ConversationTypeIcon
		conversationType={type}
		class={cn(
			'w-20 h-20 text-gray-300 mb-2 dark:text-gray-600',
			disabled && 'text-gray-400 dark:text-gray-500',
			isSelected && !disabled && 'text-primary-500 dark:text-white'
		)}
	/>

	<h3
		class={cn(
			'text-lg font-bold text-gray-900 dark:text-gray-50',
			disabled && 'text-gray-600 dark:text-gray-400'
		)}
	>
		{label}
	</h3>

	{#if enableHints}
		<p
			class={cn(
				'text-sm text-center dark:text-gray-400',
				disabled && 'text-gray-500 dark:text-gray-500',
				isSelected && !disabled && 'text-gray-600 dark:text-gray-100'
			)}
		>
			{description}
		</p>
	{/if}
</SelectableCard>
