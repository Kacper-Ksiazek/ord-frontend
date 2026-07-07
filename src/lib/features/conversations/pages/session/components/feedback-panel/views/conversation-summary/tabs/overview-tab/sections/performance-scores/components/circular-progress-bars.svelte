<script lang="ts">
	import CircularProgressBar from '$lib/components/scores/circular-progress-bar/circular-progress-bar.svelte';
	import type {
		ConversationMessagePerformanceScore,
		ConversationUserMessageAnalysisDTO
	} from '$conversations/types/domain/conversation-message-analysis';

	interface CircularProgressBarsProps {
		analyses: ConversationUserMessageAnalysisDTO[];
	}

	type PerformanceMetrics = Record<ConversationMessagePerformanceScore, number>;

	const { analyses }: CircularProgressBarsProps = $props();

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
			grammar: sums.grammar / analyses.length,
			vocabulary: sums.vocabulary / analyses.length,
			naturalness: sums.naturalness / analyses.length
		};
	});
</script>

<div class="grid grid-cols-3 gap-4">
	<CircularProgressBar label="Grammar" score={averageScores.grammar} />
	<CircularProgressBar label="Vocabulary" score={averageScores.vocabulary} />
	<CircularProgressBar label="Naturalness" score={averageScores.naturalness} />
</div>
