<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import { LEARNING_TIP_EXAMPLE_SENTENCE_ICON } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import type { LearningTipCategory } from '$conversations/types/domain/learning-tip-category';
	import { parseBoldText } from '$lib/utils/text/parse-bold-text';

	interface Props {
		exampleSentence: string[];
		category: LearningTipCategory;
	}

	let { exampleSentence, category }: Props = $props();

	const highlightStyle = getAiMessageLearningTipColors(category).highlightedText;
	const iconColor = getAiMessageLearningTipColors(category).iconColor;
</script>

{#if exampleSentence && exampleSentence.length > 0}
	<div>
		<p class="label mb-1">Example Sentences:</p>
		<div class="space-y-2">
			{#each exampleSentence as sentence (sentence)}
				<div class="analysis-card-text-box variant-neutral">
					<LEARNING_TIP_EXAMPLE_SENTENCE_ICON class={cn('w-4 h-4', iconColor)} />
					<span class="content-long">
						{#each parseBoldText(sentence) as part (part.text)}
							{#if part.bold}
								<span class={highlightStyle}>{part.text}</span>
							{:else}
								{part.text}
							{/if}
						{/each}
					</span>
				</div>
			{/each}
		</div>
	</div>
{/if}
