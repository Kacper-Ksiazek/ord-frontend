<script lang="ts">
	import type { ConversationMessageMistake } from '$conversations/types/domain/conversation-message-analysis';
	import type {
		AiAdviceBaseBlock,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base/ai-advice.types';
	import { EXPLANATION_ICON } from '$conversations/pages/session/constants/icons';
	import { MISTAKE_SEVERITY_ICONS_MAP } from '$conversations/pages/session/constants/user-message-analysis/subcategory-icons';
	import { X, Check } from 'lucide-svelte';
	import AiAdviceBase from '../../ai-advice-base/ai-advice-base.svelte';

	interface Props extends DerivedAiAdviceCardProps {
		mistake: ConversationMessageMistake;
	}

	let { mistake, isExpandable, defaultExpandState }: Props = $props();

	function toBlocks(mistake: ConversationMessageMistake): {
		headerBlocks: AiAdviceBaseBlock[];
		bodyBlocks: AiAdviceBaseBlock[];
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

<AiAdviceBase {color} {headerBlocks} {bodyBlocks} {isExpandable} {defaultExpandState} />
