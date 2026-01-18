<script lang="ts">
	import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
	import size from 'lodash/size';
	import compact from 'lodash/compact';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base.svelte';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import { getAiMessageLearningTipColors } from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/colors';
	import HighlightsCountBadge from '$lib/features/conversations/pages/session/components/shared/highlights-count-badge.svelte';
	import ToggleIconsInHighlight from '$lib/features/conversations/pages/session/components/shared/toggle-icons-in-highlight.svelte';
	import AiMessageLearningTipIcon from '$lib/features/conversations/pages/session/components/shared/ai-message-learning-tips/ai-message-learning-tip-icon.svelte';

	interface LearningTipsProps {
		learningTips: AIMessageLearningTips;
		showIconsInHighlightedParts: boolean;
	}

	let {
		learningTips, //
		showIconsInHighlightedParts = $bindable()
	}: LearningTipsProps = $props();

	const grammarTipsCount = size(learningTips.grammarTips);
	const vocabularyTipsCount = size(learningTips.vocabularyTips);
	const phraseTipsCount = size(learningTips.phraseTips);

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

	const hasTips = indicators.length > 0;
</script>

{#if hasTips}
	<AiPostProcessActionBase
		label="Wskazówki do nauki"
		onclick={() => {
			console.log('🔥 TODO: Implement support for the panel');
		}}
	>
		<div class="flex flex-row gap-2 flex-wrap items-center justify-between">
			<div class="flex flex-row gap-2 flex-wrap">
				{#each indicators as { category, count, label }}
					{@const { twColor, chipBorder } = getAiMessageLearningTipColors(category)}

					<HighlightsCountBadge {count} {label} color={twColor} class={chipBorder}>
						{#snippet icon()}
							<AiMessageLearningTipIcon tipCategory={category} />
						{/snippet}
					</HighlightsCountBadge>
				{/each}
			</div>

			<ToggleIconsInHighlight bind:checked={showIconsInHighlightedParts} />
		</div>
	</AiPostProcessActionBase>
{/if}
