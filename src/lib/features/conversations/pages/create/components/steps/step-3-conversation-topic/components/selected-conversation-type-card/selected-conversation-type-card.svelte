<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import type { ConversationAITone, ConversationType } from '$conversations/types';
	import ConversationTypeIcon from '$conversations/shared/components/conversation-type-icon.svelte';
	import ConversationToneIcon from '$conversations/shared/components/conversation-tone-icon.svelte';
	import {
		CONVERSATION_TYPES,
		CONVERSATION_TONES,
		DISABLED_CONVERSATION_TYPES
	} from '$conversations/shared/constants/enum-values';
	import {
		getCreateConversationPayload,
		setCreateConversationPayload,
		topicPickerStore
	} from '$conversations/pages/create/stores';
	import { getConversationTypeLabel, getConversationToneLabel } from '$conversations/shared/utils';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { EditableSelectionSummaryCard } from './components';

	interface Props {
		/** When true, type and tone cards stack vertically (e.g. summary step two-column layout). */
		stackVertically?: boolean;
	}

	let { stackVertically = false }: Props = $props();

	const payload = $derived(getCreateConversationPayload());
	const selectedConversationType = $derived(payload.type);
	const selectedConversationTone = $derived(payload.tone);

	const menuItemClasses =
		'flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 text-sm text-ink outline-none hover:bg-accent-soft';
	const menuItemIconClass = 'size-8 shrink-0';

	const conversationTypesForDropdown = $derived(
		[...CONVERSATION_TYPES].sort((a, b) => {
			const aDisabled = DISABLED_CONVERSATION_TYPES.has(a);
			const bDisabled = DISABLED_CONVERSATION_TYPES.has(b);
			if (aDisabled === bDisabled) return 0;

			return aDisabled ? 1 : -1;
		})
	);

	function selectConversationType(type: ConversationType) {
		const currentPayload = getCreateConversationPayload();

		if (currentPayload.type !== type) {
			setCreateConversationPayload({ type, topic: undefined });
			topicPickerStore.resetCustomState();
		} else {
			setCreateConversationPayload({ type });
		}
	}

	function selectConversationTone(tone: ConversationAITone) {
		setCreateConversationPayload({ tone });
	}
</script>

{#if selectedConversationType || selectedConversationTone}
	<div
		class={stackVertically
			? 'mb-0 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3'
			: 'mb-6 flex gap-4'}
	>
		{#if selectedConversationType}
			<EditableSelectionSummaryCard
				label={m['features.conversation.create.step-3.selected_type.label']()}
				title={getConversationTypeLabel(selectedConversationType)}
				editAriaLabel={m['features.conversation.create.step-3.summary_cards.edit_type.aria_label']()}
				editTooltip={m['features.conversation.create.step-3.summary_cards.edit_type.tooltip']()}
			>
				{#snippet icon(className)}
					<ConversationTypeIcon conversationType={selectedConversationType} class={className} />
				{/snippet}
				{#snippet dropdownContent()}
					{#each conversationTypesForDropdown as type (type)}
						{@const disabled = DISABLED_CONVERSATION_TYPES.has(type)}
						{@const isSelected = selectedConversationType === type}
						<DropdownMenu.Item
							{disabled}
							onSelect={() => selectConversationType(type)}
							class={cn(
								menuItemClasses,
								isSelected && 'bg-accent-soft font-medium',
								disabled && 'cursor-not-allowed opacity-50'
							)}
						>
							<ConversationTypeIcon
								conversationType={type}
								class={cn(menuItemIconClass, disabled && 'text-ink-subtle')}
							/>
							<span class="min-w-0 flex-1 truncate text-left">
								{getConversationTypeLabel(type)}
							</span>
							{#if disabled}
								<span class="shrink-0 text-xs text-ink-muted">
									{m['features.conversation.create.step-1.coming_soon_badge']()}
								</span>
							{/if}
						</DropdownMenu.Item>
					{/each}
				{/snippet}
			</EditableSelectionSummaryCard>
		{/if}

		{#if selectedConversationTone}
			<EditableSelectionSummaryCard
				label={m['features.conversation.create.step-3.selected_tone.label']()}
				title={getConversationToneLabel(selectedConversationTone)}
				editAriaLabel={m['features.conversation.create.step-3.summary_cards.edit_tone.aria_label']()}
				editTooltip={m['features.conversation.create.step-3.summary_cards.edit_tone.tooltip']()}
			>
				{#snippet icon(className)}
					<ConversationToneIcon tone={selectedConversationTone} class={className} />
				{/snippet}
				{#snippet dropdownContent()}
					{#each CONVERSATION_TONES as tone (tone)}
						{@const isSelected = selectedConversationTone === tone}
						<DropdownMenu.Item
							onSelect={() => selectConversationTone(tone)}
							class={cn(menuItemClasses, isSelected && 'bg-accent-soft font-medium')}
						>
							<ConversationToneIcon {tone} class={menuItemIconClass} />
							<span class="min-w-0 flex-1 truncate text-left">
								{getConversationToneLabel(tone)}
							</span>
						</DropdownMenu.Item>
					{/each}
				{/snippet}
			</EditableSelectionSummaryCard>
		{/if}
	</div>
{/if}
