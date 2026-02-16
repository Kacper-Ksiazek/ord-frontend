<script lang="ts">
	import CircularProgressBar from '$lib/components/scores/circular-progress-bar/circular-progress-bar.svelte';
	import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';

	interface CircularProgressBarsProps {
		feedbacks: ConversationUserMessageFeedbackDTO[];
	}

	const { feedbacks }: CircularProgressBarsProps = $props();

	const averageScores: Record<MessageFeedbackCriteria, number> = $derived.by(() => {
		const sums = feedbacks.reduce(
			(acc, f) => {
				acc.MISTAKES += f.mistakes?.length ?? 0;
				acc.STRENGTHS += f.strengths?.length ?? 0;
				acc.SUGGESTIONS += f.suggestions?.length ?? 0;
				return acc;
			},
			{ MISTAKES: 0, STRENGTHS: 0, SUGGESTIONS: 0 }
		);

		const numberOfFeedbacks = feedbacks.length;

		return {
			MISTAKES: sums.MISTAKES / numberOfFeedbacks,
			STRENGTHS: sums.STRENGTHS / numberOfFeedbacks,
			SUGGESTIONS: sums.SUGGESTIONS / numberOfFeedbacks
		};
	});
</script>

<div class="grid grid-cols-3 gap-4">
	<CircularProgressBar label="Grammar" score={averageScores.MISTAKES} />
	<CircularProgressBar label="Vocabulary" score={averageScores.STRENGTHS} />
	<CircularProgressBar label="Naturalness" score={averageScores.SUGGESTIONS} />
</div>
