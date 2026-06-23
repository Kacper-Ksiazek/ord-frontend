<script lang="ts">
	import type { AIMessageLearningTips } from '$lib/types/ongoing-conversation/api/responses';
	import size from 'lodash/size';
	import compact from 'lodash/compact';
	import { fade } from 'svelte/transition';
	import AiPostProcessActionBase from '../../../ai-post-process-action-base/ai-post-process-action-base.svelte';
	import PlayMessageAudio from '../../../ai-post-process-action-base/components/play-message-audio.svelte';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import HighlightsCountBadge from '$lib/features/conversations/pages/session/components/shared/highlights-count-badge.svelte';
	import AiMessageLearningTipIcon from '$lib/features/conversations/pages/session/components/shared/ai-message-learning-tips/ai-message-learning-tip-icon.svelte';
	import TextWithThreeDotsAnimation from '$lib/components/utils/text-with-three-dots-animation.svelte';
	import { getSidepanelContext } from '$lib/features/conversations/pages/session/contexts/sidepanel-context.svelte';
	import { speakTextPlayback } from '$lib/utils/speak-text.svelte';
	import { formatTime } from '$lib/utils/format-time';

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

	const isThisMessagePlaying = $derived(speakTextPlayback.id === messageIndex);
	const showPlaybackProgress = $derived(
		isThisMessagePlaying && speakTextPlayback.progress.duration > 0
	);
	const progressPercent = $derived(
		speakTextPlayback.progress.duration > 0
			? Math.min(
					100,
					(speakTextPlayback.progress.currentTime / speakTextPlayback.progress.duration) * 100
				)
			: 0
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
		{#if showPlaybackProgress}
			<div class="flex flex-col gap-2" aria-live="polite" transition:fade={{ duration: 200 }}>
				<div
					class="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"
					role="progressbar"
					aria-valuemin="0"
					aria-valuemax={speakTextPlayback.progress.duration}
					aria-valuenow={speakTextPlayback.progress.currentTime}
					aria-label="Playback progress"
				>
					<div
						class="h-full w-full origin-left rounded-full bg-primary-600 will-change-transform transition-transform duration-300 ease-linear"
						style:transform="scaleX({progressPercent / 100})"
					></div>
				</div>
				<p class="text-xs text-gray-500 dark:text-gray-400">
					{formatTime(speakTextPlayback.progress.currentTime)} / {formatTime(
						speakTextPlayback.progress.duration
					)}
				</p>
			</div>
		{/if}
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
