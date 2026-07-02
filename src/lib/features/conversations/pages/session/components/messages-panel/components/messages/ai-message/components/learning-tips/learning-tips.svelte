<script lang="ts">
	import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
	import size from 'lodash/size';
	import compact from 'lodash/compact';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base/ai-post-process-action-base.svelte';
	import PlayMessageAudio from '../../../ai-post-process-action-base/components/play-message-audio.svelte';
	import PlayMessageAudioProgress from '../../../ai-post-process-action-base/components/play-message-audio-progress.svelte';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import HighlightsCountBadge from '$lib/features/conversations/pages/session/components/shared/highlights-count-badge.svelte';
	import AiMessageLearningTipIcon from '$lib/features/conversations/pages/session/components/shared/ai-message-learning-tips/ai-message-learning-tip-icon.svelte';
	import { TextDotsAnimation as TextWithThreeDotsAnimation } from '$lib/components/feedback/text-dots-animation';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';

	interface LearningTipsProps {
		message: string;
		learningTips: AIMessageLearningTips | null;
		showIconsInHighlightedParts: boolean;
		messageIndex: number;
	}

	let {
		message,
		learningTips,
		showIconsInHighlightedParts = $bindable(),
		messageIndex
	}: LearningTipsProps = $props();

	const isGeneratingTips = $derived(!learningTips);

	const sidepanelContext = getSidepanelContext();

	const isSelected = $derived(
		sidepanelContext.isOpened && sidepanelContext.learningTipsPreviewMessageOrder === messageIndex
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
	label="Wskazówki do nauki"
	isGenerating={isGeneratingTips}
	bind:showIconsInHighlightedParts
	{isSelected}
	onPreviewContentClick={(e) => {
		const isSameMessageClickedAgain =
			sidepanelContext.learningTipsPreviewMessageOrder === messageIndex;

		if (isSameMessageClickedAgain) {
			sidepanelContext.isOpened = false;

			setTimeout(() => {
				sidepanelContext.learningTipsPreviewMessageOrder = null;
			}, 300);
		} else {
			sidepanelContext.isOpened = true;
			sidepanelContext.learningTipsPreviewMessageOrder = messageIndex;
			sidepanelContext.analysisPreview = null;
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

			<HighlightsCountBadge {count} {label} {iconColor} class="">
				{#snippet icon()}
					<AiMessageLearningTipIcon tipCategory={category} />
				{/snippet}
			</HighlightsCountBadge>
		{/each}
	{/snippet}

	{#if isGeneratingTips}
		<TextWithThreeDotsAnimation
			text="Trwa przygotowywanie materiałów edukacyjnych"
			dotsWrapperClass="mb-1"
		/>
	{/if}
</AiPostProcessActionBase>
