<script lang="ts">
	import type { AIMessageGrammarTip } from '$lib/types/ongoing-conversation/api/responses';
	import type { AiAdviceBaseV2Block } from '../ai-advice.types';
	import { EXPLANATION_ICON, AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '../constants/icons';
	import AiAdviceBaseV2 from '../ai-advice-base-v2.svelte';

	interface Props {
		tip: AIMessageGrammarTip;
	}

	let { tip }: Props = $props();

	function toBlocks(tip: AIMessageGrammarTip): {
		headerBlocks: AiAdviceBaseV2Block[];
		bodyBlocks: AiAdviceBaseV2Block[];
	} {
		return {
			headerBlocks: [
				{
					type: 'translation',
					label: 'Phrase',
					translation: {
						text: tip.phrase,
						Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP['GRAMMAR'],
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
					text: tip.explanation,
					Icon: EXPLANATION_ICON
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
	const { headerBlocks, bodyBlocks } = toBlocks(tip);
</script>

<AiAdviceBaseV2 {color} {headerBlocks} {bodyBlocks} />
