<script lang="ts">
	import type { AIMessageVocabularyTip } from '$lib/types/ongoing-conversation/api/responses';
	import type { AiAdviceBaseV2Block } from '../../ai-advice-base-v2/ai-advice.types';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import AiAdviceBaseV2 from '../../ai-advice-base-v2/ai-advice-base-v2.svelte';

	interface Props {
		tip: AIMessageVocabularyTip;
	}

	let { tip }: Props = $props();

	function toBlocks(tip: AIMessageVocabularyTip): {
		headerBlocks: AiAdviceBaseV2Block[];
		bodyBlocks: AiAdviceBaseV2Block[];
	} {
		return {
			headerBlocks: [
				{
					type: 'translation',
					label: 'Word',
					translation: {
						text: tip.word,
						Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP['VOCABULARY'],
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
					label: 'Definition',
					text: tip.definition,
					Icon: EXPLANATION_ICON
				},
				{
					type: 'text',
					label: 'Usage Note',
					text: tip.usageNote
				},
				{
					type: 'examples',
					label: 'Example Sentences',
					examples: tip.exampleSentences,
					parseBold: true,
					category: 'VOCABULARY'
				}
			]
		};
	}

	const color = 'blue' as const;
	const { headerBlocks, bodyBlocks } = toBlocks(tip);
</script>

<AiAdviceBaseV2 {color} {headerBlocks} {bodyBlocks} />
