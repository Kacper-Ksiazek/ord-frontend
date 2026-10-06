<script lang="ts">
	import type { Snippet } from 'svelte';
	import type {
		ConversationAIInterlocutorAvatarId,
		ConversationSummaryDTO,
		ConversationAITone,
		ConversationType
	} from '$conversations/types';

	type ConversationRow = {
		topic?: string | null;
		type?: ConversationType | null;
		aiTone?: ConversationAITone | null;
		aiInterlocutorName?: string | null;
		aiInterlocutorAvatarId?: string | null;
		updatedAt?: string | null;
		createdAt?: string | null;
	};
	import AiInterlocutorAvatar from '$conversations/shared/components/ai-interlocutor-avatar.svelte';
	import ConversationTypeIcon from '$conversations/shared/components/conversation-type-icon.svelte';
	import { getConversationToneLabel, getConversationTypeLabel } from '$conversations/shared/utils';
	import { Badge } from '$lib/components/utils/badge';
	import { formatRelativeOrMediumDate } from '$lib/utils/format-relative-or-medium-date';
	import { ChevronRight } from 'lucide-svelte';

	interface Props {
		conversation: ConversationRow | ConversationSummaryDTO;
		onclick: () => void;
		dataTestId?: string;
		showChevron?: boolean;
		trailing?: Snippet;
	}

	const { conversation, onclick, dataTestId, showChevron = true, trailing }: Props = $props();

	const interlocutorName = $derived(conversation.aiInterlocutorName?.trim() ?? '');
	const conversationType = $derived(conversation.type ?? undefined);

	const activityLabel = $derived(
		formatRelativeOrMediumDate(conversation.updatedAt ?? conversation.createdAt ?? new Date())
	);

	const ariaLabel = $derived.by(() => {
		const parts = [`Open conversation: ${conversation.topic}`];

		if (interlocutorName) {
			parts.push(`with ${interlocutorName}`);
		}

		return parts.join(' ');
	});
</script>

<div
	class="group flex w-full items-stretch gap-2 rounded-[10px] border border-line bg-surface px-3 py-3 transition-colors hover:bg-accent-soft"
	data-testid={dataTestId}
>
	<div class="flex shrink-0 self-center">
		<span
			class="flex size-12 shrink-0 items-center justify-center rounded-[10px] bg-accent-soft p-2 text-ink-muted transition-colors group-hover:bg-primary-200 [&_svg]:size-7 [&_svg]:shrink-0"
			aria-hidden="true"
		>
			<ConversationTypeIcon {conversationType} class="size-7" />
		</span>
	</div>

	<button
		type="button"
		class="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ink/15"
		aria-label={ariaLabel}
		{onclick}
	>
		<div class="min-w-0 flex flex-1 flex-col gap-2.5">
			<div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
				<p class="min-w-0 text-base leading-snug">
					<span class="font-semibold text-ink">{conversation.topic}</span>
				</p>

				{#if interlocutorName}
					<span
						class="inline-flex min-w-0 max-w-full items-center gap-1.5 text-base leading-snug text-ink-muted"
					>
						<span class="text-ink-subtle" aria-hidden="true">·</span>
						<span class="relative size-5 shrink-0 overflow-hidden rounded-full ring-1 ring-line">
							<AiInterlocutorAvatar
								avatarId={conversation.aiInterlocutorAvatarId as ConversationAIInterlocutorAvatarId}
								size="fullsize"
								class="h-full w-full object-cover"
							/>
						</span>
						<span class="truncate">{interlocutorName}</span>
					</span>
				{/if}
			</div>

			<div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
				<Badge class="transition-colors group-hover:bg-primary-200">
					{getConversationTypeLabel(conversationType)}
				</Badge>
				{#if conversation.aiTone}
					<Badge class="transition-colors group-hover:bg-primary-200">
						{getConversationToneLabel(conversation.aiTone)}
					</Badge>
				{/if}
				<span class="text-sm leading-relaxed text-ink-muted">{activityLabel}</span>
			</div>
		</div>

		{#if showChevron}
			<ChevronRight
				class="size-4 shrink-0 self-center text-ink-subtle transition-colors group-hover:text-ink-muted"
				aria-hidden="true"
			/>
		{/if}
	</button>

	{#if trailing}
		<div class="flex shrink-0 items-center self-center pr-0.5">
			{@render trailing()}
		</div>
	{/if}
</div>
