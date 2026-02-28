<script lang="ts">
	import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
	import size from 'lodash/size';
	import compact from 'lodash/compact';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base/ai-post-process-action-base.svelte';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import HighlightsCountBadge from '$lib/features/conversations/pages/session/components/shared/highlights-count-badge.svelte';
	import AiMessageLearningTipIcon from '$lib/features/conversations/pages/session/components/shared/ai-message-learning-tips/ai-message-learning-tip-icon.svelte';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';

	interface LearningTipsProps {
		learningTips: AIMessageLearningTips | null;
		showIconsInHighlightedParts: boolean;
	}

	let {
		learningTips, //
		showIconsInHighlightedParts = $bindable()
	}: LearningTipsProps = $props();

	const grammarTipsCount = size(learningTips?.grammarTips);
	const vocabularyTipsCount = size(learningTips?.vocabularyTips);
	const phraseTipsCount = size(learningTips?.phraseTips);

	const indicators = compact([
		grammarTipsCount > 0 && {
			category: 'GRAMMAR' as LearningTipCategory,
			count: grammarTipsCount,
			label: 'Gramatyka'
		},
		vocabularyTipsCount > 0 && {
			category: 'VOCABULARY' as LearningTipCategory,
			count: vocabularyTipsCount,
			label: 'Słownictwo'
		},
		phraseTipsCount > 0 && {
			category: 'PHRASES' as LearningTipCategory,
			count: phraseTipsCount,
			label: 'Frazy'
		}
	]) satisfies {
		category: LearningTipCategory;
		count: number;
		label: string;
	}[];
</script>

<AiPostProcessActionBase
	label="Wskazówki do nauki"
	tooltipContent="Kliknij, aby otworzyć wskazówki do nauki"
	tooltipPlacement="right-start"
	isGenerating={!learningTips}
	onclick={() => {
		console.log('🔥 TODO: Implement support for the panel');
	}}
>
	{#if learningTips}
		<div class="flex flex-row gap-2 items-center justify-between">
			<div class="flex flex-row gap-2 overflow-x-auto min-w-0">
				{#each indicators as { category, count, label } (category)}
					{@const { iconColor } = getAiMessageLearningTipColors(category)}

					<HighlightsCountBadge {count} {label} {iconColor} class="">
						{#snippet icon()}
							<AiMessageLearningTipIcon tipCategory={category} />
						{/snippet}
					</HighlightsCountBadge>
				{/each}
			</div>
		</div>
	{:else}
		<TextWithThreeDotsAnimation
			text="Trwa przygotowywanie materiałów edukacyjnych"
			dotsWrapperClass="mb-1"
		/>
	{/if}
</AiPostProcessActionBase>
