<script lang="ts">
	import { ScrollableWrapper } from '$lib/components/utils/scrollable-wrapper';
	import CircularProgressBar from '$lib/components/scores/circular-progress-bar/circular-progress-bar.svelte';
	import { ScoreDiffIndicator } from '$lib/components/scores';
	import AiInterlocutorAvatar from '$lib/features/conversations/shared/components/ai-interlocutor-avatar.svelte';
	import type { ConversationUserMessageAnalysisDTO } from '$conversations/types';
	import type { CompactConversationUserMessage } from '$conversations/types';
	import type { ConversationMessagePerformanceScore } from '$conversations/types';
	import { getConversationContext } from '$conversations/pages/session/contexts/conversation-context.svelte';
	import AuthUserAvatar from '$lib/components/auth-user-avatar.svelte';
	import UserMessageTextContent from '$conversations/pages/session/components/messages-panel/components/messages/user-message/lib/user-message-text-content.svelte';

	interface OverviewTabProps {
		feedback: ConversationUserMessageAnalysisDTO;
		messageContent: string | null;
		userMessages: CompactConversationUserMessage[];
	}

	type PerformanceMetrics = Record<ConversationMessagePerformanceScore, number>;

	const { interlocutor } = getConversationContext();
	const { feedback, messageContent, userMessages }: OverviewTabProps = $props();

	const analyses: ConversationUserMessageAnalysisDTO[] = $derived(
		userMessages.map((msg) => msg.analysis).filter((f) => f !== null)
	);

	const averageScores: PerformanceMetrics = $derived.by(() => {
		const sums = analyses.reduce(
			(acc, f) => {
				acc.grammar += f.grammar;
				acc.vocabulary += f.vocabulary;
				acc.naturalness += f.naturalness;

				return acc;
			},
			{ grammar: 0, vocabulary: 0, naturalness: 0 } satisfies PerformanceMetrics
		);

		return {
			grammar: sums.grammar / (analyses.length || 1),
			vocabulary: sums.vocabulary / (analyses.length || 1),
			naturalness: sums.naturalness / (analyses.length || 1)
		};
	});
</script>

{#snippet performanceScore(props: { label: string; score: number | null; averageScore: number })}
	<div class="flex flex-col items-center gap-2">
		<CircularProgressBar label={props.label} score={props.score} />

		<div class="flex items-center gap-2">
			<span class="text-sm text-muted-small">
				avg: {props.averageScore.toFixed(1)}
			</span>
			<ScoreDiffIndicator currentScore={props.score} averageScore={props.averageScore} />
		</div>
	</div>
{/snippet}

<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0 gap-12">
	<div class="space-y-2">
		<div class="space-y-2">
			<div class="flex items-center gap-2">
				<AuthUserAvatar size={40} />
				<h3 class="heading-5 m-0">Message</h3>
				<span>TODO: Navigate to message</span>
			</div>
		</div>

		<div class="content-long">
			<UserMessageTextContent
				messageIndex={0}
				messageContent={messageContent ?? ''}
				analysis={feedback}
				disableHoverHighlight={true}
				showIconsInHighlightedParts={false}
			/>
		</div>
	</div>

	<div class="space-y-2">
		<div class="space-y-2">
			<div class="flex items-center gap-2">
				<AiInterlocutorAvatar
					avatarId={interlocutor.avatarId}
					size="fullsize"
					class="rounded-full w-10 h-10"
				/>
				<h3 class="heading-5 m-0">Tutor Comment</h3>
			</div>
		</div>

		<div class="flex flex-col gap-4">
			<span class="content-long">{feedback.tutorComment}</span>

			<div class="grid grid-cols-3 gap-4">
				{@render performanceScore({
					label: 'Grammar',
					score: feedback.grammar,
					averageScore: averageScores.grammar
				})}

				{@render performanceScore({
					label: 'Vocabulary',
					score: feedback.vocabulary,
					averageScore: averageScores.vocabulary
				})}

				{@render performanceScore({
					label: 'Naturalness',
					score: feedback.naturalness,
					averageScore: averageScores.naturalness
				})}
			</div>
		</div>
	</div>
</ScrollableWrapper>
