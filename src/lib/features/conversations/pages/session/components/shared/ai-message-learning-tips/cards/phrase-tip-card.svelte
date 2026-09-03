<script lang="ts">
	import type { AIMessagePhraseTip } from '$conversations/types';
	import type {
		AiAdviceBaseBlock,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base/ai-advice.types';
	import { PHRASE_TYPE_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/subcategory-icons';
	import AiAdviceBase from '../../ai-advice-base/ai-advice-base.svelte';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';

	interface Props extends DerivedAiAdviceCardProps {
		tip: AIMessagePhraseTip;
	}

	let { tip, isExpandable, defaultExpandState, showCategoryLabel = false }: Props = $props();

	function getPhraseTypeLabel(phraseType: 'LITERAL' | 'IDIOMATIC'): string {
		return phraseType === 'IDIOMATIC' ? 'Idiomatic' : 'Literal';
	}

	function toBlocks(tip: AIMessagePhraseTip): {
		headerBlocks: AiAdviceBaseBlock[];
		bodyBlocks: AiAdviceBaseBlock[];
	} {
		const phraseType = tip.phraseType ?? 'LITERAL';
		const register = tip.register ?? 'NEUTRAL';

		return {
			headerBlocks: [
				{
					type: 'translation',
					label: 'Phrase',
					translation: {
						text: tip.phrase ?? '',
						badges: [
							{
								text: getPhraseTypeLabel(phraseType),
								Icon: PHRASE_TYPE_ICONS_MAP[phraseType]
							},
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
					label: 'Meaning',
					text: tip.meaning ?? ''
				},
				{
					type: 'examples',
					label: 'Example Sentences',
					examples: tip.exampleSentences ?? [],
					parseBold: true,
					category: 'PHRASES'
				}
			]
		};
	}

	const color = 'purple' as const;
	const { headerBlocks, bodyBlocks } = $derived(toBlocks(tip));
</script>

<AiAdviceBase
	{color}
	{headerBlocks}
	{bodyBlocks}
	{isExpandable}
	{defaultExpandState}
	{showCategoryLabel}
	categoryLabel="Phrases"
	categoryIcon={AI_MESSAGE_LEARNING_TIP_ICONS_MAP.PHRASES}
/>
