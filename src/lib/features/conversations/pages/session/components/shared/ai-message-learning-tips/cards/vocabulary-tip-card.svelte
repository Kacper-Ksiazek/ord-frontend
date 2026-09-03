<script lang="ts">
	import type { AIMessageVocabularyTip } from '$conversations/types';
	import type {
		AiAdviceBaseBlock,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base/ai-advice.types';
	import AiAdviceBase from '../../ai-advice-base/ai-advice-base.svelte';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';

	interface Props extends DerivedAiAdviceCardProps {
		tip: AIMessageVocabularyTip;
	}

	let { tip, isExpandable, defaultExpandState, showCategoryLabel = false }: Props = $props();

	function toBlocks(tip: AIMessageVocabularyTip): {
		headerBlocks: AiAdviceBaseBlock[];
		bodyBlocks: AiAdviceBaseBlock[];
	} {
		const register = tip.register ?? 'NEUTRAL';

		return {
			headerBlocks: [
				{
					type: 'translation',
					label: 'Word',
					translation: {
						text: tip.word ?? '',
						badges: [
							{
								text: register,
								register
							}
						]
					},
					nativeLanguage: {
						text: tip.nativeLanguageEquivalent ?? ''
					}
				}
			],
			bodyBlocks: [
				{
					type: 'text',
					label: 'Definition',
					text: tip.definition ?? ''
				},
				{
					type: 'text',
					label: 'Usage Note',
					text: tip.usageNote ?? ''
				},
				{
					type: 'examples',
					label: 'Example Sentences',
					examples: tip.exampleSentences ?? [],
					parseBold: true,
					category: 'VOCABULARY'
				}
			]
		};
	}

	const color = 'blue' as const;
	const { headerBlocks, bodyBlocks } = $derived(toBlocks(tip));
</script>

<AiAdviceBase
	{color}
	{headerBlocks}
	{bodyBlocks}
	{isExpandable}
	{defaultExpandState}
	{showCategoryLabel}
	categoryLabel="Vocabulary"
	categoryIcon={AI_MESSAGE_LEARNING_TIP_ICONS_MAP.VOCABULARY}
/>
