<script lang="ts">
	import { Pencil } from 'lucide-svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { GenerateAIInterlocutor } from './components';
	import { SelectedConversationTypeCard } from '../step-3-conversation-topic/components';
	import { getCreateConversationPayload } from '$lib/features/conversations/pages/create/stores/create-conversation-payload.svelte';
	import * as m from '$lib/paraglide/messages.js';

	interface Props {
		onEditTopic: () => void;
	}

	let { onEditTopic }: Props = $props();

	const payload = getCreateConversationPayload();
</script>

<div class="flex h-full min-h-0 w-full flex-col gap-4 overflow-hidden lg:gap-6">
	<p class="shrink-0 text-sm text-gray-500 dark:text-gray-400">
		{m['features.conversation.create.step-4.description']()}
	</p>

	<div
		class="flex min-h-0 min-w-0 flex-1 flex-col gap-6 lg:flex-row lg:items-start lg:gap-8 xl:gap-10"
	>
		<div
			class="flex w-full shrink-0 flex-col items-center lg:w-fit lg:max-w-[min(100%,24rem)] lg:items-start"
		>
			<GenerateAIInterlocutor />
		</div>

		<div class="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-4 lg:gap-6">
			<h2
				class="border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400"
			>
				{m['features.conversation.create.step-4.details_section.title']()}
			</h2>

			<SelectedConversationTypeCard stackVertically />

			{#if payload.topic}
				<div
					class="rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-900/20"
				>
					<div class="flex items-start justify-between gap-3">
						<div class="flex min-w-0 flex-1 flex-col gap-1">
							<p class="text-sm text-gray-500 dark:text-gray-400">
								{m['features.conversation.create.step-4.selected_topic.label']()}
							</p>
							<p class="text-base font-semibold text-gray-900 dark:text-gray-50">{payload.topic}</p>
						</div>
						<IconButton
							icon={Pencil}
							ariaLabel={m['features.conversation.create.step-4.selected_topic.edit.aria_label']()}
							tooltip={m['features.conversation.create.step-4.selected_topic.edit.tooltip']()}
							type="OUTLINED"
							variant="TEXT"
							class="size-8 shrink-0"
							onClick={(e) => {
								e.stopPropagation();
								onEditTopic();
							}}
						/>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
