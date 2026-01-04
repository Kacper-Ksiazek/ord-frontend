<script lang="ts">
	import isNil from 'lodash/isNil';
	import compact from 'lodash/compact';
	import { getHighlightedTextColors } from './utils';
	import type { FeedbackTextHighlightProps } from './feedback-text-highlight.types';
	import { includesEitherWay } from '$lib/utils/functions/includes-either-way';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { cn, Tooltip } from 'flowbite-svelte';
	import { getCardBorderColor } from '$lib/features/conversations/pages/session/components/feedback-panel/feedback-panel-colors.utils';
	import { getLeadingColorForFeedbackMetric } from '$lib/features/conversations/pages/session/utils/get-leading-color-for-feedback-metric';
	import FeedbackMetricIcon from '$lib/features/conversations/pages/session/components/shared/feedback-metric-icon.svelte';
	import MistakeCard from '$lib/features/conversations/pages/session/components/feedback-panel/components/mistake-card.svelte';
	import StrengthCard from '$lib/features/conversations/pages/session/components/feedback-panel/components/strength-card.svelte';
	import SuggestionCard from '$lib/features/conversations/pages/session/components/feedback-panel/components/suggestion-card.svelte';
	import { Tabs } from '$lib/components/tabs';
	import type { Tab } from '$lib/components/tabs';
	import { getFeedbackCriteriaColor } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { CircleAlert, CircleCheck, Lightbulb } from 'lucide-svelte';

	const { id, highlightType, highlightedText, feedback }: FeedbackTextHighlightProps = $props();

	const cards = {
		MISTAKES: feedback?.mistakes?.find((m) => includesEitherWay(m.phrase, highlightedText)),
		STRENGTHS: feedback?.strengths?.find((s) => includesEitherWay(s.phrase, highlightedText)),
		SUGGESTIONS: feedback?.suggestions?.find((s) => includesEitherWay(s.original, highlightedText))
	} satisfies Record<MessageFeedbackCriteria, unknown>;

	const isMistakeCardAvailable = !isNil(cards.MISTAKES);
	const isStrengthCardAvailable = !isNil(cards.STRENGTHS);
	const isSuggestionCardAvailable = !isNil(cards.SUGGESTIONS);

	const moreThanOneCardAvailable =
		Number(isMistakeCardAvailable) +
			Number(isStrengthCardAvailable) +
			Number(isSuggestionCardAvailable) >
		1;

	let activeCard = $state<MessageFeedbackCriteria>(highlightType);

	const availableTabs = compact([
		isMistakeCardAvailable ? { id: 'MISTAKES', label: 'Mistake', icon: CircleAlert } : null,
		isSuggestionCardAvailable ? { id: 'SUGGESTIONS', label: 'Suggestion', icon: Lightbulb } : null,
		isStrengthCardAvailable ? { id: 'STRENGTHS', label: 'Strength', icon: CircleCheck } : null
	] as (Tab | null)[]);

	function handleMouseLeave() {
		activeCard = highlightType;
	}

	function handleHighlightClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		// FLOW: Mistakes -> Suggestions -> Strengths
		switch (activeCard) {
			case 'MISTAKES':
				if (isSuggestionCardAvailable) {
					activeCard = 'SUGGESTIONS';
				} else if (isStrengthCardAvailable) {
					activeCard = 'STRENGTHS';
				}
				break;

			case 'SUGGESTIONS':
				if (isStrengthCardAvailable) {
					activeCard = 'STRENGTHS';
				} else if (isMistakeCardAvailable) {
					activeCard = 'MISTAKES';
				}
				break;

			case 'STRENGTHS':
				if (isMistakeCardAvailable) {
					activeCard = 'MISTAKES';
				} else if (isSuggestionCardAvailable) {
					activeCard = 'SUGGESTIONS';
				}
				break;

			default:
				break;
		}
	}

	function handleHighlightKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			e.preventDefault();
			e.stopPropagation();
			handleHighlightClick(new MouseEvent('click'));
		}
		if (e.key === 'Tab' && moreThanOneCardAvailable) {
			if (activeCard === 'MISTAKES' && isSuggestionCardAvailable) {
				e.preventDefault();
				e.stopPropagation();
				activeCard = 'SUGGESTIONS';
			} else if (activeCard === 'MISTAKES' && isStrengthCardAvailable) {
				e.preventDefault();
				e.stopPropagation();
				activeCard = 'STRENGTHS';
			} else if (activeCard === 'SUGGESTIONS' && isStrengthCardAvailable) {
				e.preventDefault();
				e.stopPropagation();
				activeCard = 'STRENGTHS';
			}
		}
	}
</script>

<span
	{id}
	class={cn(
		'px-1 rounded  transition-colors inline-flex items-center', //
		getHighlightedTextColors(activeCard),
		moreThanOneCardAvailable ? 'cursor-pointer' : 'cursor-default'
	)}
	onclick={handleHighlightClick}
	onkeydown={handleHighlightKeydown}
	onmouseleave={handleMouseLeave}
	onblur={handleMouseLeave}
	role="button"
	tabindex="0"
>
	<span class="inline-flex items-center gap-1 mr-1">
		{#if isMistakeCardAvailable}
			<CircleAlert
				class={cn(
					'w-3 h-3', //
					activeCard !== 'MISTAKES' ? 'opacity-40' : ''
				)}
			/>
		{/if}

		{#if isSuggestionCardAvailable}
			<Lightbulb
				class={cn(
					'w-3 h-3', //
					activeCard !== 'SUGGESTIONS' ? 'opacity-40' : ''
				)}
			/>
		{/if}

		{#if isStrengthCardAvailable}
			<CircleCheck
				class={cn(
					'w-3 h-3', //
					activeCard !== 'STRENGTHS' ? 'opacity-40' : ''
				)}
			/>
		{/if}
	</span>

	{highlightedText}
</span>

<Tooltip
	triggeredBy={`#${id}`}
	class={cn(
		'bg-white dark:bg-gray-800 shadow-lg border-2 rounded-lg select-none', //
		getCardBorderColor(activeCard)
	)}
>
	<div class="p-2 w-[500px]">
		{#if moreThanOneCardAvailable}
			<Tabs
				tabs={availableTabs}
				bind:activeTab={activeCard}
				activeColor={getFeedbackCriteriaColor(activeCard)}
				class="mb-3"
			/>
		{:else}
			<h3
				class={cn(
					'flex items-center gap-2 text-sm font-semibold mb-2',
					getLeadingColorForFeedbackMetric(activeCard)
				)}
			>
				<FeedbackMetricIcon criteria={activeCard} class="w-4 h-4" />
				<span>
					{activeCard === 'MISTAKES'
						? 'Mistake'
						: activeCard === 'STRENGTHS'
							? 'Strength'
							: 'Suggestion'}
				</span>
			</h3>
		{/if}

		{#if activeCard === 'MISTAKES' && cards.MISTAKES}
			<MistakeCard mistake={cards.MISTAKES} />
		{:else if activeCard === 'SUGGESTIONS' && cards.SUGGESTIONS}
			<SuggestionCard suggestion={cards.SUGGESTIONS} />
		{:else if activeCard === 'STRENGTHS' && cards.STRENGTHS}
			<StrengthCard strength={cards.STRENGTHS} />
		{/if}
	</div>
</Tooltip>
