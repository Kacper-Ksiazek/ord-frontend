<script lang="ts">
	import { Pencil } from 'lucide-svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { GenerateAIInterlocutor } from './components';
	import { SelectedConversationTypeCard } from '../step-3-conversation-topic/components';
	import { getCreateConversationPayload } from '$conversations/pages/create/stores';
	import * as m from '$lib/paraglide/messages.js';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	interface Props {
		onEditTopic: () => void;
	}

	let { onEditTopic }: Props = $props();

	const payload = getCreateConversationPayload();
</script>

<div
	class="flex h-full min-h-0 w-full flex-col gap-3 overflow-y-auto md:gap-4"
	data-testid={E2E_TEST_IDS.createConversation.stepSummary}
>
	<p class="shrink-0 text-sm text-gray-500 dark:text-gray-400">
		{m['features.conversation.create.step-4.description']()}
	</p>

	<div
		class="flex min-h-0 min-w-0 flex-1 flex-col gap-4 md:flex-row md:items-start md:gap-6 lg:gap-8"
	>
		<div
			class="flex w-full shrink-0 flex-col items-center md:w-auto md:max-w-[min(40%,clamp(10rem,22vw,18rem))] md:items-start"
		>
			<GenerateAIInterlocutor />
		</div>

		<div class="flex min-h-0 min-w-0 w-full flex-1 flex-col gap-3 md:gap-4">
			<h2
				class="shrink-0 border-b border-gray-200 pb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:text-gray-400"
			>
				{m['features.conversation.create.step-4.details_section.title']()}
			</h2>

			<SelectedConversationTypeCard stackVertically />

			{#if payload.topic}
				<div
					class="rounded-lg border border-primary-200 bg-primary-50 px-[clamp(0.75rem,2vw,1rem)] py-[clamp(0.75rem,2vh,1rem)] dark:border-primary-800 dark:bg-primary-900/20"
				>
					<div class="flex items-start justify-between gap-3">
						<div class="flex min-w-0 flex-1 flex-col gap-0.5">
							<p class="text-xs text-gray-500 dark:text-gray-400">
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
