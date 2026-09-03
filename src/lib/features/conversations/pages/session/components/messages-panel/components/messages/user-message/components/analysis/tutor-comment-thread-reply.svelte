<script lang="ts">
	import AiInterlocutorAvatar from '$conversations/shared/components/ai-interlocutor-avatar.svelte';
	import type { ConversationAIInterlocutorAvatarId } from '$conversations/types';
	import type { ConversationUserMessageAnalysisDTO } from '$conversations/types';
	import { getConversationContext } from '$conversations/pages/session/contexts/conversation-context.svelte';
	import { getScoreChipClasses } from '$lib/components/scores/constants/score-colors';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { ChevronDown, CornerDownRight, Sparkles } from 'lucide-svelte';
	import { slide } from 'svelte/transition';
	import PlayMessageAudio from '../../../ai-post-process-action-base/components/play-message-audio.svelte';
	import PlayMessageAudioProgress from '../../../ai-post-process-action-base/components/play-message-audio-progress.svelte';

	interface TutorCommentThreadReplyProps {
		analysis: ConversationUserMessageAnalysisDTO;
		messageIndex: number;
	}

	const { analysis, messageIndex }: TutorCommentThreadReplyProps = $props();

	const { interlocutor } = getConversationContext();
	let isExpanded = $state(false);

	const tutorComment = $derived(analysis.tutorComment?.trim() ?? '');

	const scores = $derived([
		{ label: m['features.conversation.session.scores.grammar'](), score: analysis.grammar ?? 0 },
		{
			label: m['features.conversation.session.scores.vocabulary'](),
			score: analysis.vocabulary ?? 0
		},
		{
			label: m['features.conversation.session.scores.naturalness'](),
			score: analysis.naturalness ?? 0
		}
	]);

	const toggleAriaLabel = $derived(
		isExpanded
			? m['features.conversation.session.scores.show_less']()
			: m['features.conversation.session.scores.show_more']()
	);
</script>

{#snippet scoreChip(props: { label: string; score: number })}
	{@const chip = getScoreChipClasses(props.score)}
	<span class="inline-flex shrink-0 items-center gap-1.5">
		<span
			class={cn(
				'flex h-5 min-w-5 items-center justify-center rounded px-1 text-[11px] font-semibold leading-none',
				chip.bg,
				chip.text
			)}
		>
			{props.score}
		</span>
		<span class="text-xs text-ink-muted">{props.label}</span>
	</span>
{/snippet}

{#snippet scoreHeader()}
	<div class="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
		<div class="flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-muted">
			<Sparkles class="size-3.5" />
			<span>{m['features.conversation.session.scores.rating_heading']()}</span>
		</div>

		{#each scores as item (item.label)}
			{@render scoreChip(item)}
		{/each}
	</div>
{/snippet}

<div class="flex w-full flex-row items-start gap-2">
	<CornerDownRight class="mt-2.5 size-4 shrink-0 text-ink-subtle" aria-hidden="true" />

	<AiInterlocutorAvatar
		avatarId={interlocutor.avatarId as ConversationAIInterlocutorAvatarId}
		size="fullsize"
		class="h-9 w-9 shrink-0 rounded-full object-cover"
	/>

	<div
		class="min-w-0 flex-1 overflow-hidden rounded-[10px] border border-line bg-message-ai text-ink"
	>
		{#if tutorComment}
			<button
				type="button"
				class="flex min-h-9 w-full items-center gap-0 px-4 py-2 text-left transition-colors hover:bg-accent-soft"
				aria-expanded={isExpanded}
				aria-label={toggleAriaLabel}
				onclick={() => (isExpanded = !isExpanded)}
			>
				{@render scoreHeader()}

				<ChevronDown
					class={cn(
						'ml-2 size-4 shrink-0 text-ink-muted transition-transform',
						isExpanded && 'rotate-180'
					)}
					aria-hidden="true"
				/>
			</button>

			{#if isExpanded}
				<div class="border-t border-line-subtle px-4 py-2.5" transition:slide={{ duration: 180 }}>
					<div class="message-body">{tutorComment}</div>
				</div>

				<div class="border-t border-line-subtle px-4 py-1">
					<div class="flex min-h-8 items-center gap-3">
						<div class="min-w-0 flex-1">
							<PlayMessageAudioProgress {messageIndex} />
						</div>

						<PlayMessageAudio message={tutorComment} {messageIndex} />
					</div>
				</div>
			{/if}
		{:else}
			<div class="flex min-h-9 items-center gap-0 px-4 py-2">
				{@render scoreHeader()}
			</div>
		{/if}
	</div>
</div>
