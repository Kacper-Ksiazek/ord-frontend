<script lang="ts">
	import { IconButton } from '$lib/components/buttons/icon-button';
	import SelectableCard from '$lib/components/utils/selectable-card.svelte';
	import { cn } from '$lib/utils/cn';
	import { Bookmark, X } from 'lucide-svelte';
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
	const saveForLaterLabel = $derived(
		isPinned
			? m['features.conversation.create.step-3.topic_picker.topic_row.unpin_tooltip']()
			: m['features.conversation.create.step-3.topic_picker.topic_row.pin_tooltip']()
	);
</script>

<SelectableCard
	disabled={isActionDisabled}
	onclick={isActionDisabled ? () => {} : onclick}
	data-testid={E2E_TEST_IDS.createConversation.topicRow(index)}
	class={cn(
		'flex-row items-center justify-between gap-3 px-4 py-3.5',
		selectionDisabled && 'cursor-not-allowed opacity-60'
	)}
	isSelected={isSelected && !selectionDisabled}
>
	<p class="min-w-0 flex-1 text-base font-medium leading-snug text-ink">{topic}</p>

	<IconButton
		icon={Bookmark}
		ariaLabel={saveForLaterLabel}
		tooltip={saveForLaterLabel}
		type="OUTLINED"
		variant="TEXT"
		class="size-8 shrink-0 border-none"
		iconClass={cn('size-4', isPinned && 'fill-current text-ink')}
		onClick={handlePinToggle}
		disabled={isActionDisabled}
	/>

	<IconButton
		icon={X}
		ariaLabel={m['features.conversation.create.step-3.topic_picker.topic_row.remove_tooltip']()}
		tooltip={m['features.conversation.create.step-3.topic_picker.topic_row.remove_tooltip']()}
		type="OUTLINED"
		variant={isActionDisabled ? 'TEXT' : 'DELETE'}
		class="size-8 shrink-0 border-none"
		iconClass="size-4"
		onClick={(e) => {
			e.stopPropagation();
			removeTopic(topic);
		}}
		disabled={isActionDisabled}
	/>
</SelectableCard>
