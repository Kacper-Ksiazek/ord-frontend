<script lang="ts">
	import type { AIMessageVocabularyTip } from '$conversations/types/ongoing-conversation/api/responses';
	import type {
		AiAdviceBaseBlock,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base/ai-advice.types';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import AiAdviceBase from '../../ai-advice-base/ai-advice-base.svelte';

	interface Props extends DerivedAiAdviceCardProps {
		tip: AIMessageVocabularyTip;
	}

	let { tip, isExpandable, defaultExpandState }: Props = $props();

	function toBlocks(tip: AIMessageVocabularyTip): {
		headerBlocks: AiAdviceBaseBlock[];
		bodyBlocks: AiAdviceBaseBlock[];
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

<AiAdviceBase {color} {headerBlocks} {bodyBlocks} {isExpandable} {defaultExpandState} />
