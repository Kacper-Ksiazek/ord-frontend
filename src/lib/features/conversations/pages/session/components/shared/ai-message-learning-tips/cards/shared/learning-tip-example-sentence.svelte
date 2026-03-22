<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import { LEARNING_TIP_EXAMPLE_SENTENCE_ICON } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';

	interface Props {
		exampleSentence: string[];
		category: LearningTipCategory;
	}

	let { exampleSentence, category }: Props = $props();

	const highlightStyle = getAiMessageLearningTipColors(category).highlightedText;
	const iconColor = getAiMessageLearningTipColors(category).iconColor;

	function parseBoldText(text: string) {
		const parts: Array<{ text: string; bold: boolean }> = [];
		const regex = /\*\*(.*?)\*\*/g;
		let lastIndex = 0;
		let match;

		while ((match = regex.exec(text)) !== null) {
			if (match.index > lastIndex) {
				parts.push({ text: text.slice(lastIndex, match.index), bold: false });
			}
			parts.push({ text: match[1], bold: true });
			lastIndex = match.index + match[0].length;
		}

		if (lastIndex < text.length) {
			parts.push({ text: text.slice(lastIndex), bold: false });
		}

		return parts.length > 0 ? parts : [{ text, bold: false }];
	}
</script>

{#if exampleSentence && exampleSentence.length > 0}
	<div>
		<p class="feedback-card-label">Example Sentences:</p>
		<div class="space-y-2">
			{#each exampleSentence as sentence (sentence)}
				<div class="feedback-card-text-box variant-neutral">
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
