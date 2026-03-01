<script lang="ts">
	import isNil from 'lodash/isNil';
	import compact from 'lodash/compact';
	import type { FeedbackTextHighlightProps } from './feedback-text-highlight.types';
	import { includesEitherWay } from '$lib/utils/functions/includes-either-way';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { cn, Popover } from 'flowbite-svelte';
	import FeedbackMetricIcon from '$lib/features/conversations/pages/session/components/shared/user-message-feedback/user-message-feedback-metric-icon.svelte';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import {
		MistakeCard,
		StrengthCard,
		SuggestionCard
	} from '$lib/features/conversations/pages/session/components/shared/user-message-feedback/cards';
	import { getUserMessageFeedbackColors } from '$conversations/pages/session/constants/user-message-feedback/colors';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/icons';

	const {
		id,
		highlightType,
		highlightedText,
		feedback,
		showIconsInHighlightedParts
	}: FeedbackTextHighlightProps = $props();

	const cards = {
		MISTAKES: feedback?.mistakes?.find((m) => includesEitherWay(m.phrase, highlightedText)),
		STRENGTHS: feedback?.strengths?.find((s) => includesEitherWay(s.phrase, highlightedText)),
		SUGGESTIONS: feedback?.suggestions?.find((s) => includesEitherWay(s.original, highlightedText))
	} satisfies Record<MessageFeedbackCriteria, unknown>;

	const isMistakeCardAvailable = !isNil(cards.MISTAKES);
	const isStrengthCardAvailable = !isNil(cards.STRENGTHS);
	const isSuggestionCardAvailable = !isNil(cards.SUGGESTIONS);

	const moreThanOneCardAvailable =
		compact([
			isMistakeCardAvailable, //
			isStrengthCardAvailable,
			isSuggestionCardAvailable
		]).length >= 2;

	let activeCard = $state<MessageFeedbackCriteria>(highlightType);
	const activeCardColors = $derived(getUserMessageFeedbackColors(activeCard));

	const availableTabs = compact([
		isMistakeCardAvailable && {
			id: 'MISTAKES',
			label: 'Mistake', // TODO: i18n
			icon: USER_MESSAGE_FEEDBACK_ICONS_MAP['MISTAKES']
		},
		isSuggestionCardAvailable && {
			id: 'SUGGESTIONS',
			label: 'Suggestion', // TODO: i18n
			icon: USER_MESSAGE_FEEDBACK_ICONS_MAP['SUGGESTIONS']
		},
		isStrengthCardAvailable && {
			id: 'STRENGTHS',
			label: 'Strength', // TODO: i18n
			icon: USER_MESSAGE_FEEDBACK_ICONS_MAP['STRENGTHS']
		}
	]) satisfies Tab[];

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
				activeCard = 'SUGGESTIONS';
			} else if (activeCard === 'MISTAKES' && isStrengthCardAvailable) {
				activeCard = 'STRENGTHS';
			} else if (activeCard === 'SUGGESTIONS' && isStrengthCardAvailable) {
				activeCard = 'STRENGTHS';
			} else {
				// Return when no condition is met
				return;
			}

			// Callback for every condition that is met
			e.preventDefault();
			e.stopPropagation();
		}
	}
</script>

<span
	{id}
	class={cn(
		'inline rounded transition-colors box-decoration-clone',
		activeCardColors.highlightedText,
		moreThanOneCardAvailable ? 'cursor-pointer' : 'cursor-default'
	)}
	onclick={handleHighlightClick}
	onkeydown={handleHighlightKeydown}
	onmouseleave={handleMouseLeave}
	onblur={handleMouseLeave}
	role="button"
	tabindex="0"
>
	{#if showIconsInHighlightedParts}
		{@const iconColor = activeCardColors.text}
		{@const iconSize = 'w-3 h-3'}

		<span class="inline-flex items-center gap-1 mx-0.5">
			{#if isMistakeCardAvailable}
				<FeedbackMetricIcon
					criteria="MISTAKES"
					class={cn(
						iconSize, //
						activeCard !== 'MISTAKES' ? 'opacity-60' : '',
						iconColor
					)}
				/>
			{/if}

			{#if isSuggestionCardAvailable}
				<FeedbackMetricIcon
					criteria="SUGGESTIONS"
					class={cn(
						iconSize, //
						activeCard !== 'SUGGESTIONS' ? 'opacity-60' : '',
						iconColor
					)}
				/>
			{/if}

			{#if isStrengthCardAvailable}
				<FeedbackMetricIcon
					criteria="STRENGTHS"
					class={cn(
						iconSize, //
						activeCard !== 'STRENGTHS' ? 'opacity-60' : '',
						iconColor
					)}
				/>
			{/if}
		</span>
	{/if}
	{highlightedText}
</span>

<Popover
	triggeredBy={`#${id}`}
	trigger="hover"
	class={cn(
		'w-[640px] bg-white dark:bg-gray-800 shadow-lg border-2 rounded-lg',
		activeCardColors.cardBorder
	)}
	classes={{ content: 'p-2' }}
>
	{#if moreThanOneCardAvailable}
		<Tabs
			tabs={availableTabs}
			bind:activeTab={activeCard}
			activeColor={activeCardColors.twColor}
			class="mb-3"
		/>
	{:else}
		<h3 class={cn('flex items-center gap-2 label-bold mb-2', activeCardColors.text)}>
			<FeedbackMetricIcon criteria={activeCard} class="w-4 h-4" />
			<span>
				{activeCard === 'MISTAKES' ? 'Mistake' : activeCard === 'STRENGTHS' ? 'Strength' : 'Suggestion'}
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
</Popover>
