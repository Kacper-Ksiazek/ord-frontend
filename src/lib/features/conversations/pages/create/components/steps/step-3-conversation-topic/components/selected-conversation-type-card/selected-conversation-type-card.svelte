<script lang="ts">
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

{#if selectedConversationType || selectedConversationTone}
	<div class="mb-6 flex gap-4">
		{#if selectedConversationType}
			<div
				class="flex-1 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
			>
				<div class="flex items-center gap-4">
					<ConversationTypeIcon
						conversationType={selectedConversationType}
						class="w-16 h-16 text-primary-500 dark:text-primary-400"
					/>
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
							{m['features.conversation.create.step-3.selected_type.label']()}
						</p>
						<h3 class="text-lg font-bold text-gray-900 dark:text-gray-50">
							{getConversationTypeLabel(selectedConversationType)}
						</h3>
					</div>
				</div>
			</div>
		{/if}

		{#if selectedConversationTone}
			<div
				class="flex-1 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
			>
				<div class="flex items-center gap-4">
					<ConversationToneIcon
						tone={selectedConversationTone}
						class="w-16 h-16 text-primary-500 dark:text-primary-400"
					/>
					<div>
						<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
							{m['features.conversation.create.step-3.selected_tone.label']()}
						</p>
						<h3 class="text-lg font-bold text-gray-900 dark:text-gray-50">
							{getConversationToneLabel(selectedConversationTone)}
						</h3>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
