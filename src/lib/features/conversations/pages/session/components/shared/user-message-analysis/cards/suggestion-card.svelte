<script lang="ts">
	import type { ConversationMessageSuggestion } from '$conversations/types';
	import type {
		AiAdviceBaseBlock,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base/ai-advice.types';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import { USER_MESSAGE_ANALYSIS_ICONS_MAP } from '$conversations/pages/session/constants/user-message-analysis/icons';
	import { SUGGESTION_TYPE_ICONS_MAP } from '$conversations/pages/session/constants/user-message-analysis/subcategory-icons';
	import { ArrowRight } from 'lucide-svelte';
	import AiAdviceBase from '../../ai-advice-base/ai-advice-base.svelte';

	interface Props extends DerivedAiAdviceCardProps {
		suggestion: ConversationMessageSuggestion;
	}

	let { suggestion, isExpandable, defaultExpandState }: Props = $props();

	function toBlocks(suggestion: ConversationMessageSuggestion): {
		headerBlocks: AiAdviceBaseBlock[];
		bodyBlocks: AiAdviceBaseBlock[];
	} {
		return {
			headerBlocks: [
				{
					type: 'translation',
					label: 'Original',
					translation: {
						text: suggestion.original,
						Icon: USER_MESSAGE_ANALYSIS_ICONS_MAP['SUGGESTIONS'],
						badges: [
							{
								text: suggestion.suggestionType,
								Icon: SUGGESTION_TYPE_ICONS_MAP[suggestion.suggestionType]
							}
						]
					}
				},
				{
					type: 'examples',
					label: 'Alternatives',
					examples: suggestion.alternatives,
					Icon: ArrowRight
				}
			],
			bodyBlocks: [
				{
					type: 'text',
					label: 'Explanation',
					text: suggestion.explanation,
					Icon: EXPLANATION_ICON
				}
			]
		};
	}

	const color = 'blue' as const;
	const { headerBlocks, bodyBlocks } = toBlocks(suggestion);
</script>

<AiAdviceBase {color} {headerBlocks} {bodyBlocks} {isExpandable} {defaultExpandState} />
