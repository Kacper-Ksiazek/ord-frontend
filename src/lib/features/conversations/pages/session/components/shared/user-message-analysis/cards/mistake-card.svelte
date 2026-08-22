<script lang="ts">
	import type { ConversationMessageMistake } from '$conversations/types';
	import type {
		AiAdviceBaseBlock,
		DerivedAiAdviceCardProps
	} from '../../ai-advice-base/ai-advice.types';
	import AiAdviceBase from '../../ai-advice-base/ai-advice-base.svelte';
	import { USER_MESSAGE_ANALYSIS_ICONS_MAP } from '$conversations/pages/session/constants/user-message-analysis/icons';
	import { Check, X } from 'lucide-svelte';

	interface Props extends DerivedAiAdviceCardProps {
		mistake: ConversationMessageMistake;
	}

	let { mistake, isExpandable, defaultExpandState, showCategoryLabel = false }: Props = $props();

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
					Icon: X,
					iconClass: 'text-red-600 dark:text-red-400',
					iconBgClass: 'bg-red-100/80 dark:bg-red-950/35'
				},
				{
					type: 'text',
					label: 'Correct form',
					text: mistake.correctForm,
					Icon: Check,
					iconClass: 'text-emerald-600 dark:text-emerald-400',
					iconBgClass: 'bg-emerald-100/80 dark:bg-emerald-950/35'
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

<AiAdviceBase
	{color}
	{headerBlocks}
	{bodyBlocks}
	{isExpandable}
	{defaultExpandState}
	{showCategoryLabel}
	categoryLabel="Mistake"
	categoryIcon={USER_MESSAGE_ANALYSIS_ICONS_MAP.MISTAKES}
/>
