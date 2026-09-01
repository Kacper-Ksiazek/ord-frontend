<script lang="ts">
	import type { AIMessageGrammarTip } from '$conversations/types';
	import type {
		AiAdviceBaseBlock,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base/ai-advice.types';
	import AiAdviceBase from '../../ai-advice-base/ai-advice-base.svelte';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';

	interface Props extends DerivedAiAdviceCardProps {
		tip: AIMessageGrammarTip;
	}

	let { tip, isExpandable, defaultExpandState, showCategoryLabel = false }: Props = $props();

	function toBlocks(tip: AIMessageGrammarTip): {
		headerBlocks: AiAdviceBaseBlock[];
		bodyBlocks: AiAdviceBaseBlock[];
	} {
		return {
			headerBlocks: [
				{
					type: 'translation',
					label: 'Phrase',
					translation: {
						text: tip.phrase,
						badges: [
							{
								text: tip.register,
								register: tip.register
							}
						]
					},
					nativeLanguage: {
						text: tip.nativeLanguageEquivalent
					}
				}
			],
			bodyBlocks: [
				{
					type: 'text',
					label: 'Grammar Point',
					text: tip.grammarPoint
				},
				{
					type: 'text',
					label: 'Explanation',
					text: tip.explanation
				},
				{
					type: 'examples',
					label: 'Example Sentences',
					examples: tip.exampleSentences,
					parseBold: true,
					category: 'GRAMMAR'
				}
			]
		};
	}

	const color = 'green' as const;
	const { headerBlocks, bodyBlocks } = $derived(toBlocks(tip));
</script>

<AiAdviceBase
	{color}
	{headerBlocks}
	{bodyBlocks}
	{isExpandable}
	{defaultExpandState}
	{showCategoryLabel}
	categoryLabel="Grammar"
	categoryIcon={AI_MESSAGE_LEARNING_TIP_ICONS_MAP.GRAMMAR}
/>
