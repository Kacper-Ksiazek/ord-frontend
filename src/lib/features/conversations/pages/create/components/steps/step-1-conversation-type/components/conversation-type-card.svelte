<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { Heart } from 'lucide-svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import type { ConversationType } from '$conversations/types';
	import ConversationTypeIcon from '$conversations/shared/components/conversation-type-icon.svelte';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

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
		'border border-line bg-surface text-ink-muted'
	);
</script>

<SelectableCard
	{onclick}
	{isSelected}
	{disabled}
	locked={disabled}
	data-testid={E2E_TEST_IDS.createConversation.typeCard(type)}
	class={cn(
		'relative w-full min-w-0',
		'px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.75rem,2.5vh,1.75rem)]'
	)}
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
			'mb-1 size-[clamp(2.5rem,6vh,3.5rem)] text-ink-subtle',
			disabled && 'text-ink-subtle',
			isSelected && !disabled && 'text-ink'
		)}
	/>

	<h3 class={cn('text-base font-medium text-ink sm:text-lg', disabled && 'text-ink-muted')}>
		{label}
	</h3>

	{#if enableHints}
		<p
			class={cn(
				'text-center text-xs leading-snug sm:text-sm text-ink-muted',
				disabled && 'text-ink-subtle',
				isSelected && !disabled && 'text-ink-muted'
			)}
		>
			{description}
		</p>
	{/if}
</SelectableCard>
