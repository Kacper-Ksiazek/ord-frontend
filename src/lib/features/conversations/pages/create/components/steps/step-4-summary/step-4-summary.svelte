<script lang="ts">
	import { GenerateAIInterlocutor } from './components';
	import { SelectedConversationTypeCard } from '../step-3-conversation-topic/components';
	import { getCreateConversationPayload } from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import * as m from '$lib/paraglide/messages.js';

	const payload = getCreateConversationPayload();
</script>

<div class="flex h-full min-h-0 w-full flex-col gap-6 overflow-y-auto">
	<p class="shrink-0 text-sm text-gray-500 dark:text-gray-400">
		{m['features.conversation.create.step-4.description']()}
	</p>

	<div
		class="flex min-h-0 min-w-0 flex-1 flex-col gap-8 lg:flex-row lg:items-start lg:gap-10 xl:gap-12"
	>
		<div class="flex w-full shrink-0 flex-col lg:max-w-[min(100%,32rem)]">
			<GenerateAIInterlocutor />
		</div>

		<div class="flex min-w-0 flex-1 flex-col gap-6">
			<h2
				class="border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400"
			>
				{m['features.conversation.create.step-4.details_section.title']()}
			</h2>

			<SelectedConversationTypeCard stackVertically />

			{#if payload.topic}
				<div
					class="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg border border-primary-200 dark:border-primary-800"
				>
					<div class="flex flex-col gap-1">
						<p class="text-sm text-gray-500 dark:text-gray-400 mb-1">
							{m['features.conversation.create.step-4.selected_topic.label']()}
						</p>
						<p class="text-base font-semibold text-gray-900 dark:text-gray-50">{payload.topic}</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
