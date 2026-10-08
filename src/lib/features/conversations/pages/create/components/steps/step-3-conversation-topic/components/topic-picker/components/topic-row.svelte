<script lang="ts">
	import { IconButton } from '$lib/components/buttons/icon-button';
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import { cn } from '$lib/utils/cn';
	import { Bookmark, Check, Minus } from 'lucide-svelte';
	import {
		getCreateConversationPayload,
		topicPickerStore
	} from '$conversations/pages/create/stores';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	interface TopicRowProps {
		index: number;
		topic: string;
		isPinned: boolean;
		isSelected: boolean;
		selectionDisabled?: boolean;
		onclick: () => void;
	}

	const {
		index,
		topic,
		isPinned,
		isSelected,
		selectionDisabled = false,
		onclick
	}: TopicRowProps = $props();

	function removeTopic(topicToRemove: string) {
		const payload = getCreateConversationPayload();
		if (!payload.type) {
			return;
		}
		topicPickerStore.removeTopicFromList(payload.type, topicToRemove);
	}

	function handlePinToggle(event: MouseEvent) {
		event.stopPropagation();
		const payload = getCreateConversationPayload();
		if (!payload.type || selectionDisabled) {
			return;
		}
		if (isPinned) {
			topicPickerStore.unpinTopic(payload.type, topic);
		} else {
			topicPickerStore.pinTopic(payload.type, topic);
		}
	}

	function handleSelectToggle(event: MouseEvent) {
		event.stopPropagation();
		if (selectionDisabled || isSelected) {
			return;
		}
		onclick();
	}

	const isCardDisabled = $derived(isSelected || selectionDisabled);
	const isTopicSelected = $derived(isSelected && !selectionDisabled);
	const saveForLaterLabel = $derived(
		isPinned
			? m['features.conversation.create.step-3.topic_picker.topic_row.unpin_tooltip']()
			: m['features.conversation.create.step-3.topic_picker.topic_row.pin_tooltip']()
	);
</script>

<SelectableCard
	disabled={isCardDisabled}
	onclick={isCardDisabled ? () => {} : onclick}
	data-testid={E2E_TEST_IDS.createConversation.topicRow(index)}
	class={cn(
		'flex-row items-center gap-1 !p-2',
		isTopicSelected && '!border-ink !bg-surface',
		selectionDisabled && 'cursor-not-allowed opacity-60'
	)}
	isSelected={isTopicSelected}
>
	<button
		type="button"
		role="checkbox"
		aria-checked={isTopicSelected}
		aria-label={topic}
		class={cn(
			'inline-flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors',
			'hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20',
			selectionDisabled && 'cursor-not-allowed'
		)}
		disabled={selectionDisabled}
		onclick={handleSelectToggle}
	>
		<span
			class={cn(
				'flex size-7 items-center justify-center rounded-[5px] border-2 transition-colors',
				isTopicSelected ? 'border-ink bg-ink text-surface' : 'border-line bg-surface'
			)}
			aria-hidden="true"
		>
			{#if isTopicSelected}
				<Check class="size-3.5" strokeWidth={3} />
			{/if}
		</span>
	</button>

	<button
		type="button"
		class={cn(
			'inline-flex size-7 shrink-0 items-center justify-center p-0 rounded-md transition-colors',
			'hover:bg-accent-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/20',
			isPinned ? 'text-ink hover:text-ink' : 'text-ink-muted hover:text-ink',
			selectionDisabled && 'cursor-not-allowed opacity-50'
		)}
		aria-label={saveForLaterLabel}
		aria-pressed={isPinned}
		disabled={selectionDisabled}
		onclick={handlePinToggle}
	>
		<Bookmark class={cn('size-[1.375rem]', isPinned && 'fill-current')} aria-hidden="true" />
	</button>

	<p class="min-w-0 flex-1 text-sm font-medium leading-snug text-ink">{topic}</p>

	<IconButton
		icon={Minus}
		ariaLabel={m['features.conversation.create.step-3.topic_picker.topic_row.remove_tooltip']()}
		tooltip={m['features.conversation.create.step-3.topic_picker.topic_row.remove_tooltip']()}
		type="OUTLINED"
		variant="TEXT"
		class="!size-8 shrink-0 self-center !h-8 border-none"
		iconClass="size-4"
		onClick={(e) => {
			e.stopPropagation();
			removeTopic(topic);
		}}
		disabled={selectionDisabled}
	/>
</SelectableCard>
