<script lang="ts">
	import type { ConversationMessageMistake } from '$lib/types/conversation/domain/conversation-message-feedback';
	import type {
		AiAdviceBaseV2Block,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base-v2/ai-advice.types';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import { MISTAKE_SEVERITY_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/subcategory-icons';
	import { X, Check } from 'lucide-svelte';
	import AiAdviceBaseV2 from '../../ai-advice-base-v2/ai-advice-base-v2.svelte';

	interface Props extends DerivedAiAdviceCardProps {
		mistake: ConversationMessageMistake;
	}

	let { mistake, isExpandable, defaultExpandState }: Props = $props();

	function toBlocks(mistake: ConversationMessageMistake): {
		headerBlocks: AiAdviceBaseV2Block[];
		bodyBlocks: AiAdviceBaseV2Block[];
	} {
		return {
			headerBlocks: [
				{
					type: 'badges',
					badges: [
						{
							text: mistake.errorType
						}
					],
					severity: {
						Icon: MISTAKE_SEVERITY_ICONS_MAP[mistake.severity],
						value: mistake.severity
					}
				},
				{
					type: 'text',
					label: 'Phrase',
					text: mistake.phrase,
					variant: 'red',
					Icon: X
				},
				{
					type: 'text',
					label: 'Correct form',
					text: mistake.correctForm,
					variant: 'green',
					Icon: Check
				}
			],
			bodyBlocks: [
				{
					type: 'text',
					label: 'Explanation',
					text: mistake.explanation,
					Icon: EXPLANATION_ICON
				}
			]
		};
	}

	const color = 'red' as const;
	const { headerBlocks, bodyBlocks } = toBlocks(mistake);
</script>

<AiAdviceBaseV2 {color} {headerBlocks} {bodyBlocks} {isExpandable} {defaultExpandState} />
