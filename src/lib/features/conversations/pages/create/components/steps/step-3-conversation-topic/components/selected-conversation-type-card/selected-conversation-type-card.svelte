<script lang="ts">
	import ConversationTypeIcon from '$lib/features/conversations/shared/components/conversation-type-icon.svelte';
	import ConversationToneIcon from '$lib/features/conversations/shared/components/conversation-tone-icon.svelte';
	import { Step1ConversationType } from '../../../step-1-conversation-type';
	import { Step2ConversationTone } from '../../../step-2-conversation-tone';
	import { getCreateConversationPayload } from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import {
		getConversationTypeLabel,
		getConversationToneLabel
	} from '$lib/features/conversations/shared/utils';
	import * as m from '$lib/paraglide/messages.js';
	import { EditableSelectionSummaryCard } from './components';

	const payload = getCreateConversationPayload();
	const selectedConversationType = $derived(payload.type);
	const selectedConversationTone = $derived(payload.tone);
</script>

{#if selectedConversationType || selectedConversationTone}
	<div class="mb-6 flex gap-4">
		{#if selectedConversationType}
			<EditableSelectionSummaryCard
				label={m['features.conversation.create.step-3.selected_type.label']()}
				title={getConversationTypeLabel(selectedConversationType)}
				editAriaLabel={m['features.conversation.create.step-3.summary_cards.edit_type.aria_label']()}
				editTooltip={m['features.conversation.create.step-3.summary_cards.edit_type.tooltip']()}
				modalTitle={m['features.conversation.create.step-1.header']()}
			>
				{#snippet icon(className)}
					<ConversationTypeIcon conversationType={selectedConversationType} class={className} />
				{/snippet}
				{#snippet modalBody()}
					<Step1ConversationType />
				{/snippet}
			</EditableSelectionSummaryCard>
		{/if}

		{#if selectedConversationTone}
			<EditableSelectionSummaryCard
				label={m['features.conversation.create.step-3.selected_tone.label']()}
				title={getConversationToneLabel(selectedConversationTone)}
				editAriaLabel={m['features.conversation.create.step-3.summary_cards.edit_tone.aria_label']()}
				editTooltip={m['features.conversation.create.step-3.summary_cards.edit_tone.tooltip']()}
				modalTitle={m['features.conversation.create.step-2.header']()}
			>
				{#snippet icon(className)}
					<ConversationToneIcon tone={selectedConversationTone} class={className} />
				{/snippet}
				{#snippet modalBody()}
					<Step2ConversationTone />
				{/snippet}
			</EditableSelectionSummaryCard>
		{/if}
	</div>
{/if}
