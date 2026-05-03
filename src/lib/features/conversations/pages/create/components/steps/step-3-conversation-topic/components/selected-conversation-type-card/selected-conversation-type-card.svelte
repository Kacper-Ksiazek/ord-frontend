<script lang="ts">
	import type { Snippet } from 'svelte';
	import ConversationTypeIcon from '$lib/features/conversations/shared/components/conversation-type-icon.svelte';
	import ConversationToneIcon from '$lib/features/conversations/shared/components/conversation-tone-icon.svelte';
	import { getCreateConversationPayload } from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import {
		getConversationTypeLabel,
		getConversationToneLabel
	} from '$lib/features/conversations/shared/utils';
	import * as m from '$lib/paraglide/messages.js';

	const payload = getCreateConversationPayload();
	const selectedConversationType = $derived(payload.type);
	const selectedConversationTone = $derived(payload.tone);
</script>

{#snippet selectionCard(label: string, title: string, icon: Snippet)}
	<div
		class="flex-1 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
	>
		<div class="flex items-center gap-4">
			{@render icon()}

			<div>
				<p class="text-xs text-gray-500 dark:text-gray-400">{label}</p>
				<h3 class="text-lg font-bold text-gray-900 dark:text-gray-50">{title}</h3>
			</div>
		</div>
	</div>
{/snippet}

{#if selectedConversationType || selectedConversationTone}
	<div class="mb-6 flex gap-4">
		{#if selectedConversationType}
			{#snippet typeIcon()}
				<ConversationTypeIcon
					conversationType={selectedConversationType}
					class="size-12 text-primary-500 dark:text-primary-400"
				/>
			{/snippet}

			{@render selectionCard(
				m['features.conversation.create.step-3.selected_type.label'](),
				getConversationTypeLabel(selectedConversationType),
				typeIcon
			)}
		{/if}

		{#if selectedConversationTone}
			{#snippet toneIcon()}
				<ConversationToneIcon
					tone={selectedConversationTone}
					class="size-12 text-primary-500 dark:text-primary-400"
				/>
			{/snippet}

			{@render selectionCard(
				m['features.conversation.create.step-3.selected_tone.label'](),
				getConversationToneLabel(selectedConversationTone),
				toneIcon
			)}
		{/if}
	</div>
{/if}
