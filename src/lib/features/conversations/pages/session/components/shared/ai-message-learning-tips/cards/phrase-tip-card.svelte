<script lang="ts">
	import type { AIMessagePhraseTip } from '$lib/types/ongoing-conversation/api/responses';
	import type {
		AiAdviceBaseV2Block,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base-v2/ai-advice.types';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import { PHRASE_TYPE_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/subcategory-icons';
	import AiAdviceBaseV2 from '../../ai-advice-base-v2/ai-advice-base-v2.svelte';

	interface Props extends DerivedAiAdviceCardProps {
		tip: AIMessagePhraseTip;
	}

	let { tip, isExpandable, defaultExpandState }: Props = $props();

	function getPhraseTypeLabel(phraseType: 'LITERAL' | 'IDIOMATIC'): string {
		return phraseType === 'IDIOMATIC' ? 'Idiomatic' : 'Literal';
	}

	function toBlocks(tip: AIMessagePhraseTip): {
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
						Icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP['PHRASES'],
						badges: [
							{
								text: getPhraseTypeLabel(tip.phraseType),
								Icon: PHRASE_TYPE_ICONS_MAP[tip.phraseType]
							},
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
					label: 'Meaning',
					text: tip.meaning,
					Icon: EXPLANATION_ICON
				},
				{
					type: 'examples',
					label: 'Example Sentences',
					examples: tip.exampleSentences,
					parseBold: true,
					category: 'PHRASES'
				}
			]
		};
	}

	const color = 'purple' as const;
	const { headerBlocks, bodyBlocks } = toBlocks(tip);
</script>

<AiAdviceBaseV2 {color} {headerBlocks} {bodyBlocks} {isExpandable} {defaultExpandState} />
