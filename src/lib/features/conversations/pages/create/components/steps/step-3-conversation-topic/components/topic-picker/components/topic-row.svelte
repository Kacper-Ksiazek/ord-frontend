<script lang="ts">
	import { IconButton } from '$lib/components/buttons/icon-button';
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import { cn } from 'flowbite-svelte';
	import { Pin, PinOff, X } from 'lucide-svelte';
	import { topicPickerStore } from '$conversations/pages/create/stores/topic-picker.store.svelte';
	import { getCreateConversationPayload } from '$conversations/pages/create/stores/create-conversation-payload.svelte';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

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
		if (!payload.type || isActionDisabled) {
			return;
		}
		if (isPinned) {
			topicPickerStore.unpinTopic(payload.type, topic);
		} else {
			topicPickerStore.pinTopic(payload.type, topic);
		}
	}

	const isActionDisabled = $derived(isSelected || selectionDisabled);
</script>

<SelectableCard
	disabled={isActionDisabled}
	onclick={isActionDisabled ? () => {} : onclick}
	data-testid={E2E_TEST_IDS.createConversation.topicRow(index)}
	class={cn(
		'flex-row gap-2 justify-between items-center px-2 py-1',
		'border border-gray-200 dark:border-slate-600',
		selectionDisabled && 'cursor-not-allowed opacity-60',
		isSelected &&
			'border-primary-400 ring-1 ring-primary-300 dark:border-primary-500 dark:ring-primary-800'
	)}
	isSelected={isSelected && !selectionDisabled}
>
	<div class="flex min-w-0 flex-1 items-center gap-2">
		<span
			class={cn(
				'flex h-8 min-w-8 shrink-0 items-center justify-center rounded-lg text-sm font-semibold tabular-nums',
				'bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-gray-50',
				isSelected && 'bg-primary-600 text-white dark:bg-primary-500 dark:text-white'
			)}>{index + 1}</span
		>

		<span
			class={cn(
				'text-sm min-w-0 flex-1 py-1 pr-2',
				isSelected && 'text-gray-900 dark:text-gray-50',
				!isSelected && 'text-gray-800 dark:text-gray-200'
			)}>{topic}</span
		>
	</div>

	{#if isPinned}
		<IconButton
			icon={PinOff}
			ariaLabel={m['features.conversation.create.step-3.topic_picker.topic_row.unpin_tooltip']()}
			tooltip={m['features.conversation.create.step-3.topic_picker.topic_row.unpin_tooltip']()}
			type="OUTLINED"
			variant="TEXT"
			class="shrink-0 self-center size-7"
			iconClass="h-3.5 w-3.5"
			onClick={handlePinToggle}
			disabled={isActionDisabled}
		/>
	{:else}
		<IconButton
			icon={Pin}
			ariaLabel={m['features.conversation.create.step-3.topic_picker.topic_row.pin_tooltip']()}
			tooltip={m['features.conversation.create.step-3.topic_picker.topic_row.pin_tooltip']()}
			type="OUTLINED"
			variant="TEXT"
			class="shrink-0 self-center size-7"
			iconClass="h-3.5 w-3.5"
			onClick={handlePinToggle}
			disabled={isActionDisabled}
		/>
	{/if}

	<IconButton
		icon={X}
		ariaLabel={m['features.conversation.create.step-3.topic_picker.topic_row.remove_tooltip']()}
		tooltip={m['features.conversation.create.step-3.topic_picker.topic_row.remove_tooltip']()}
		type="OUTLINED"
		variant={isActionDisabled ? 'TEXT' : 'DELETE'}
		class="shrink-0 self-center size-7"
		iconClass="h-3.5 w-3.5"
		onClick={(e) => {
			e.stopPropagation();
			removeTopic(topic);
		}}
		disabled={isActionDisabled}
	/>
</SelectableCard>
