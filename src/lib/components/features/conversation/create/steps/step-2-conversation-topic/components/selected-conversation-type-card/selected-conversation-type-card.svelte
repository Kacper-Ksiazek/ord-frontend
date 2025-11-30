<script lang="ts">
	import ConversationTypeIcon from '$lib/components/features/conversation/conversation-type-icon.svelte';
	import { conversationTypes } from '../../../step-1-conversation-type/conversation-types.constants';
	import { getCreateConversationPayload } from '../../../../stores/create-conversation-payload.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const payload = getCreateConversationPayload();
	const selectedConversationType = $derived.by(() => {
		if (!payload.type) return null;
		return conversationTypes.find((t) => t.type === payload.type);
	});

	const getTypeLabel = (type: string) => {
		const typeKey = type.toLowerCase().replace(/_/g, '_');
		return m[`features.conversation.create.step-1.types.${typeKey}.label` as keyof typeof m]();
	};
</script>

{#if selectedConversationType}
	<div
		class="mb-6 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
	>
		<div class="flex items-center gap-4">
			<ConversationTypeIcon
				conversationType={selectedConversationType.type}
				class="w-16 h-16 text-primary-500 dark:text-primary-400"
			/>
			<div>
				<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
					{m['features.conversation.create.step-2.selected_type.label']()}
				</p>
				<h3 class="text-lg font-bold text-gray-900 dark:text-gray-50">
					{getTypeLabel(selectedConversationType.type)}
				</h3>
			</div>
		</div>
	</div>
{/if}
