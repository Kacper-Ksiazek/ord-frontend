<script lang="ts">
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import { LEARNING_TIP_EXAMPLE_SENTENCE_ICON } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import type { LearningTipCategory } from '$conversations/types';
	import { parseBoldText } from '$lib/utils/text/parse-bold-text';

	interface Props {
		exampleSentence: string[];
		category: LearningTipCategory;
	}

	let { exampleSentence, category }: Props = $props();

	const highlightStyle = $derived(getAiMessageLearningTipColors(category).highlightedText);
</script>

{#if exampleSentence && exampleSentence.length > 0}
	<div class="flex flex-col gap-1">
		<p class="analysis-card-label">Example Sentences</p>
		<div class="flex flex-col gap-1">
			{#each exampleSentence as sentence (sentence)}
				<div class="flex items-center gap-1.5">
					<LEARNING_TIP_EXAMPLE_SENTENCE_ICON class="h-3.5 w-3.5 shrink-0 text-ink-muted" />
					<p class="analysis-card-text">
						{#each parseBoldText(sentence) as part (part.text)}
							{#if part.bold}
								<span class={highlightStyle}>{part.text}</span>
							{:else}
								{part.text}
							{/if}
						{/each}
					</p>
				</div>
			{/each}
		</div>
	</div>
{/if}
