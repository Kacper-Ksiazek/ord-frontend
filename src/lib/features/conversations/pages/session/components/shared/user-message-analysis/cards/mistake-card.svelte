<script lang="ts">
	import type { ConversationMessageMistake } from '$conversations/types';
	import type {
		AiAdviceBaseBlock,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base/ai-advice.types';
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
						value: mistake.severity
					}
				},
				{
					type: 'text',
					label: 'Phrase',
					text: mistake.phrase,
					variant: 'red'
				},
				{
					type: 'text',
					label: 'Correct form',
					text: mistake.correctForm
				}
			],
			bodyBlocks: [
				{
					type: 'text',
					label: 'Explanation',
					text: mistake.explanation
				}
			]
		};
	}

	const color = 'red' as const;
	const { headerBlocks, bodyBlocks } = $derived(toBlocks(mistake));
</script>

<AiAdviceBase {color} {headerBlocks} {bodyBlocks} {isExpandable} {defaultExpandState} />
