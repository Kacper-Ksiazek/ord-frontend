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
			'mb-2 h-20 w-20 text-ink-subtle',
			disabled && 'text-ink-subtle',
			isSelected && !disabled && 'text-ink'
		)}
	/>

	<h3 class={cn('text-lg font-medium text-ink', disabled && 'text-ink-muted')}>
		{label}
	</h3>

	{#if enableHints}
		<p
			class={cn(
				'text-center text-sm text-ink-muted',
				disabled && 'text-ink-subtle',
				isSelected && !disabled && 'text-ink-muted'
			)}
		>
			{description}
		</p>
	{/if}
</SelectableCard>
