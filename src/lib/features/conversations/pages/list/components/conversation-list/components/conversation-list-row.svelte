<script lang="ts">
	import type {
		ConversationAIInterlocutorAvatarId,
		ConversationSummaryDTO
	} from '$lib/types/conversation/domain/conversation';
	import AiInterlocutorAvatar from '$lib/features/conversations/shared/components/ai-interlocutor-avatar.svelte';
	import ConversationTypeIcon from '$lib/features/conversations/shared/components/conversation-type-icon.svelte';
	import {
		getConversationTypeLabel,
		getConversationToneLabel
	} from '$lib/features/conversations/shared/utils';
	import { cn } from 'flowbite-svelte';
	import { formatRelativeOrMediumDate } from '$lib/utils/format-relative-or-medium-date';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	interface Props {
		conversation: ConversationSummaryDTO;
		onclick: () => void;
	}

	const { conversation, onclick }: Props = $props();

	const activityLabel = $derived(
		formatRelativeOrMediumDate(conversation.updatedAt || conversation.createdAt)
	);

	const ariaLabel = $derived.by(() => {
		const parts = [`Open conversation: ${conversation.topic}`];
		if (conversation.aiInterlocutorName?.trim()) {
			parts.push(`with ${conversation.aiInterlocutorName.trim()}`);
		}

		return parts.join(' ');
	});

	const chipClass = cn(
		'label-small shrink-0 whitespace-nowrap rounded-md bg-gray-100 px-2 py-1 dark:bg-gray-700'
	);
</script>

<li class="list-none">
	<button
		type="button"
		data-testid={E2E_TEST_IDS.conversations.row(conversation.id)}
		class={cn(
			'group w-full rounded-xl border border-gray-200 bg-white px-6 py-4 text-left transition-colors',
			'dark:border-gray-700 dark:bg-gray-800',
			'hover:border-primary-500 dark:hover:border-primary-500 hover:[&_svg]:opacity-100',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
			'dark:focus-visible:ring-offset-gray-900'
		)}
		aria-label={ariaLabel}
		{onclick}
	>
		<div class="flex items-center gap-3 sm:gap-4">
			<ConversationTypeIcon
				conversationType={conversation.type}
				class="size-12 shrink-0 text-primary-600 dark:text-primary-400 opacity-70 transition-opacity"
			/>

			<div class="min-w-0 flex-1 space-y-1">
				<p class="heading-6 text-truncate">
					{conversation.topic}
				</p>

				<div
					class="mt-1.5 flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					<div
						class="relative size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-gray-200 dark:ring-gray-600"
					>
						<AiInterlocutorAvatar
							avatarId={conversation.aiInterlocutorAvatarId as ConversationAIInterlocutorAvatarId}
							size="fullsize"
							class="h-full w-full object-cover"
						/>
					</div>
					{#if conversation.aiInterlocutorName?.trim()}
						<span class="text-muted-small max-w-[10rem] shrink-0 truncate">
							{conversation.aiInterlocutorName.trim()}
						</span>
					{/if}
					<span class={chipClass}>{conversation.proficiencyLevel}</span>
					<span class={chipClass}>{getConversationTypeLabel(conversation.type)}</span>
					<span class={chipClass}>{getConversationToneLabel(conversation.aiTone)}</span>
				</div>
			</div>

			<div class="shrink-0 text-right">
				<p class="caption">{activityLabel}</p>
			</div>
		</div>
	</button>
</li>
