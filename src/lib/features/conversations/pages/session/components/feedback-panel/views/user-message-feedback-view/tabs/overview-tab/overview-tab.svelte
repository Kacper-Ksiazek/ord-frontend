<script lang="ts">
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import { Badge } from 'flowbite-svelte';
	import CircularProgressBar from '$lib/components/scores/circular-progress-bar/circular-progress-bar.svelte';
	import { ScoreBox } from '$lib/components/scores';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import type { ConversationMessagePerformanceScore } from '$lib/types/conversation/domain/conversation-message-feedback';

	interface OverviewTabProps {
		feedback: ConversationUserMessageFeedbackDTO;
		messageContent: string | null;
		userMessages: CompactConversationUserMessage[];
	}

	type PerformanceMetrics = Record<ConversationMessagePerformanceScore, number>;

	const { feedback, messageContent, userMessages }: OverviewTabProps = $props();

	const feedbacks: ConversationUserMessageFeedbackDTO[] = $derived(
		userMessages.map((msg) => msg.feedback).filter((f) => f !== null)
	);

	const averageScores: PerformanceMetrics = $derived.by(() => {
		const sums = feedbacks.reduce(
			(acc, f) => {
				acc.grammar += f.grammar;
				acc.vocabulary += f.vocabulary;
				acc.naturalness += f.naturalness;

				return acc;
			},
			{ grammar: 0, vocabulary: 0, naturalness: 0 } satisfies PerformanceMetrics
		);

		return {
			grammar: sums.grammar / (feedbacks.length || 1),
			vocabulary: sums.vocabulary / (feedbacks.length || 1),
			naturalness: sums.naturalness / (feedbacks.length || 1)
		};
	});

	const averageCharacterCount = $derived.by(() => {
		if (userMessages.length === 0) return 0;

		const totalChars = userMessages.reduce((acc, msg) => acc + msg.content.length, 0);

		return Math.round(totalChars / userMessages.length);
	});

	const currentCharacterCount = messageContent?.length ?? 0;
</script>

{#snippet performanceScore(props: { label: string; score: number | null; averageScore: number })}
	<div class="flex flex-col items-center gap-2">
		<CircularProgressBar label={props.label} score={props.score} />
		<div class="flex items-center gap-2">
			<ScoreBox score={props.score} />
			<span class="text-xs text-muted-small">
				avg: {props.averageScore.toFixed(1)}
			</span>
		</div>
	</div>
{/snippet}

<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0">
	<div class="space-y-6">
		<!-- Tutor Comment -->
		{#if feedback.tutorComment}
			<div
				class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
			>
				<div class="flex flex-wrap gap-2">
					<Badge color="primary" large class="px-3 py-1.5 max-w-full">
						<span class="font-medium wrap-break-word">{feedback.tutorComment}</span>
					</Badge>
				</div>
			</div>
		{/if}

		<!-- Performance Scores -->
		<div class="space-y-4">
			<h3 class="heading-5">Performance Scores</h3>

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

		<!-- Message Content -->
		{#if messageContent}
			<div class="space-y-2">
				<h3 class="heading-5">Message</h3>
				<div
					class="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
				>
					<p class="body-small whitespace-pre-wrap">{messageContent}</p>
				</div>
				<div class="flex items-center gap-4 text-sm text-muted-small">
					<span>Characters: {currentCharacterCount}</span>
					<span>Average: {averageCharacterCount}</span>
				</div>
			</div>
		{/if}
	</div>
</ScrollableWrapper>
