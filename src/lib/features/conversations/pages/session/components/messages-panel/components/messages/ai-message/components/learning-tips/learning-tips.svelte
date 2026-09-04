<script lang="ts">
	import type { AIMessageLearningTips } from '$conversations/types';
	import { compact } from 'es-toolkit';
	import { size } from 'es-toolkit/compat';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base/ai-post-process-action-base.svelte';
	import PlayMessageAudio from '../../../ai-post-process-action-base/components/play-message-audio.svelte';
	import PlayMessageAudioProgress from '../../../ai-post-process-action-base/components/play-message-audio-progress.svelte';
	import type { LearningTipCategory } from '$conversations/types';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import HighlightsCountBadge from '$conversations/pages/session/components/shared/highlights-count-badge.svelte';
	import AiMessageLearningTipIcon from '$conversations/pages/session/components/shared/ai-message-learning-tips/ai-message-learning-tip-icon.svelte';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';
	import {
		getSidepanelContext,
		openSummaryForMessage
	} from '$conversations/pages/session/contexts/sidepanel-context.svelte';
	import { E2E_TEST_IDS } from '$conversations/testing/test-ids';

	interface LearningTipsProps {
		message: string;
		learningTips: AIMessageLearningTips | null;
		messageIndex: number;
	}

	let { message, learningTips, messageIndex }: LearningTipsProps = $props();

	const isGeneratingTips = $derived(!learningTips);

	const sidepanelContext = getSidepanelContext();

	const isSelected = $derived(
		sidepanelContext.isOpened &&
			sidepanelContext.summaryTab === 'learning-tips' &&
			sidepanelContext.filterMessageOrder === messageIndex
	);

	const grammarTipsCount = $derived(size(learningTips?.grammarTips));
	const vocabularyTipsCount = $derived(size(learningTips?.vocabularyTips));
	const phraseTipsCount = $derived(size(learningTips?.phraseTips));

	const indicators = $derived(
		compact([
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
		}[]
	);
</script>

<AiPostProcessActionBase
	dataTestId={E2E_TEST_IDS.session.messageLearningTips(messageIndex)}
	label="Wskazówki"
	isGenerating={isGeneratingTips}
	{isSelected}
	onPreviewContentClick={(e) => {
		const isSameMessageFilter =
			sidepanelContext.summaryTab === 'learning-tips' &&
			sidepanelContext.filterMessageOrder === messageIndex;

		if (sidepanelContext.isOpened && isSameMessageFilter) {
			sidepanelContext.isOpened = false;
			sidepanelContext.filterMessageOrder = null;
		} else {
			openSummaryForMessage(sidepanelContext, 'learning-tips', messageIndex);
		}

		(e.target as HTMLElement).blur();
	}}
>
	{#snippet headerActions()}
		<PlayMessageAudio {message} {messageIndex} />
	{/snippet}

	{#snippet playbackProgress()}
		<PlayMessageAudioProgress {messageIndex} />
	{/snippet}

	{#snippet badges()}
		{#each indicators as { category, count, label } (category)}
			{@const { iconColor } = getAiMessageLearningTipColors(category)}

			<HighlightsCountBadge {count} {label} {iconColor}>
				{#snippet icon()}
					<AiMessageLearningTipIcon tipCategory={category} />
				{/snippet}
			</HighlightsCountBadge>
		{/each}
	{/snippet}

	{#if isGeneratingTips}
		<div class="text-xs text-ink-muted">
			<TextWithThreeDotsAnimation text="Przygotowywanie wskazówek" dotsWrapperClass="mb-0.5" />
		</div>
	{/if}
</AiPostProcessActionBase>
