<script lang="ts">
	import type { ConversationMessageSuggestion } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type {
		AiAdviceBaseV2Block,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base-v2/ai-advice.types';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/icons';
	import { SUGGESTION_TYPE_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/subcategory-icons';
	import { ArrowRight } from 'lucide-svelte';
	import AiAdviceBaseV2 from '../../ai-advice-base-v2/ai-advice-base-v2.svelte';

	interface Props extends DerivedAiAdviceCardProps {
		suggestion: ConversationMessageSuggestion;
	}

	let { suggestion, isExpandable }: Props = $props();

	function toBlocks(suggestion: ConversationMessageSuggestion): {
		headerBlocks: AiAdviceBaseV2Block[];
		bodyBlocks: AiAdviceBaseV2Block[];
	} {
		return {
			headerBlocks: [
				{
					type: 'translation',
					label: 'Original',
					translation: {
						text: suggestion.original,
						Icon: USER_MESSAGE_FEEDBACK_ICONS_MAP['SUGGESTIONS'],
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

<AiAdviceBaseV2 {color} {headerBlocks} {bodyBlocks} {isExpandable} />
