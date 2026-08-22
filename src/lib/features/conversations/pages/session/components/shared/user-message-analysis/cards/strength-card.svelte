<script lang="ts">
	import type { ConversationMessageStrength } from '$conversations/types';
	import type {
		AiAdviceBaseBlock,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base/ai-advice.types';
	import AiAdviceBase from '../../ai-advice-base/ai-advice-base.svelte';
	import { USER_MESSAGE_ANALYSIS_ICONS_MAP } from '$conversations/pages/session/constants/user-message-analysis/icons';

	interface Props extends DerivedAiAdviceCardProps {
		strength: ConversationMessageStrength;
	}

	let { strength, isExpandable, defaultExpandState, showCategoryLabel = false }: Props = $props();

	function toBlocks(strength: ConversationMessageStrength): {
		headerBlocks: AiAdviceBaseBlock[];
		bodyBlocks: AiAdviceBaseBlock[];
	} {
		return {
			headerBlocks: [
				{
					type: 'translation',
					label: 'Phrase',
					translation: {
						text: strength.phrase,
						badges: [
							{
								text: strength.strengthType
							}
						]
					}
				}
			],
			bodyBlocks: [
				{
					type: 'text',
					label: 'Explanation',
					text: strength.explanation
				}
			]
		};
	}

	const color = 'green' as const;
	const { headerBlocks, bodyBlocks } = $derived(toBlocks(strength));
</script>

<AiAdviceBase
	{color}
	{headerBlocks}
	{bodyBlocks}
	{isExpandable}
	{defaultExpandState}
	{showCategoryLabel}
	categoryLabel="Strength"
	categoryIcon={USER_MESSAGE_ANALYSIS_ICONS_MAP.STRENGTHS}
/>
