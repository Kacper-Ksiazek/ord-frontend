<script lang="ts">
	import CircularProgressBar from '$lib/components/scores/circular-progress-bar/circular-progress-bar.svelte';
	import type {
		ConversationMessagePerformanceScore,
		ConversationUserMessageFeedbackDTO
	} from '$lib/types/conversation/domain/conversation-message-feedback';

	interface CircularProgressBarsProps {
		feedbacks: ConversationUserMessageFeedbackDTO[];
	}

	type PerformanceMetrics = Record<ConversationMessagePerformanceScore, number>;

	const { feedbacks }: CircularProgressBarsProps = $props();

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
			grammar: sums.grammar / feedbacks.length,
			vocabulary: sums.vocabulary / feedbacks.length,
			naturalness: sums.naturalness / feedbacks.length
		};
	});
</script>

<div class="grid grid-cols-3 gap-4">
	<CircularProgressBar label="Grammar" score={averageScores.grammar} />
	<CircularProgressBar label="Vocabulary" score={averageScores.vocabulary} />
	<CircularProgressBar label="Naturalness" score={averageScores.naturalness} />
</div>
