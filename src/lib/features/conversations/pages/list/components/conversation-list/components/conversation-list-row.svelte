<script lang="ts">
	import type {
		ConversationAIInterlocutorAvatarId,
		ConversationSummaryDTO
	} from '$conversations/types';
	import AiInterlocutorAvatar from '$conversations/shared/components/ai-interlocutor-avatar.svelte';
	import ConversationTypeIcon from '$conversations/shared/components/conversation-type-icon.svelte';
	import { getConversationTypeLabel, getConversationToneLabel } from '$conversations/shared/utils';
	import { Badge } from '$lib/components/utils/badge';
	import { cn } from '$lib/utils/cn';
	import { formatRelativeOrMediumDate } from '$lib/utils/format-relative-or-medium-date';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';
	import ConversationListRowActions from './conversation-list-row-actions.svelte';

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
</script>

<li class="list-none">
	<div
		class={cn(
			'group flex w-full items-stretch rounded-[10px] border border-line bg-surface transition-colors',
			'hover:bg-accent-soft'
		)}
	>
		<button
			type="button"
			data-testid={E2E_TEST_IDS.conversations.row(conversation.id)}
			class={cn(
				'flex min-w-0 flex-1 items-center gap-3 px-3 py-3 text-left sm:gap-4',
				'bg-transparent',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/15'
			)}
			aria-label={ariaLabel}
			{onclick}
		>
			<span
				class="flex size-10 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft text-ink-muted"
			>
				<ConversationTypeIcon conversationType={conversation.type} class="size-6" />
			</span>

			<div class="min-w-0 flex-1 space-y-1.5">
				<p class="truncate text-base font-semibold text-ink">
					{conversation.topic}
				</p>

				<div
					class="flex min-w-0 flex-nowrap items-center gap-2 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
				>
					<div class="relative size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-line">
						<AiInterlocutorAvatar
							avatarId={conversation.aiInterlocutorAvatarId as ConversationAIInterlocutorAvatarId}
							size="fullsize"
							class="h-full w-full object-cover"
						/>
					</div>
					{#if conversation.aiInterlocutorName?.trim()}
						<span class="max-w-[10rem] shrink-0 truncate text-sm text-ink-muted">
							{conversation.aiInterlocutorName.trim()}
						</span>
					{/if}
					<Badge>{conversation.proficiencyLevel}</Badge>
					<Badge>{getConversationTypeLabel(conversation.type)}</Badge>
					<Badge>{getConversationToneLabel(conversation.aiTone)}</Badge>
				</div>
			</div>

			<div class="shrink-0 text-right">
				<p class="text-xs text-ink-subtle">{activityLabel}</p>
			</div>
		</button>

		<div class="flex shrink-0 items-center pr-2">
			<ConversationListRowActions conversationId={conversation.id} />
		</div>
	</div>
</li>
