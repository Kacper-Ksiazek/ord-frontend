<script lang="ts">
	import isNil from 'lodash/isNil';
	import compact from 'lodash/compact';
	import type { AnalysisTextHighlightProps } from './analysis-text-highlight.types';
	import { includesEitherWay } from '$lib/utils/functions/includes-either-way';
	import type { MessageAnalysisCriteria } from '$conversations/types';
	import { cn, Popover } from 'flowbite-svelte';
	import AnalysisMetricIcon from '$lib/features/conversations/pages/session/components/shared/user-message-analysis/user-message-analysis-metric-icon.svelte';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import {
		MistakeCard,
		StrengthCard,
		SuggestionCard
	} from '$lib/features/conversations/pages/session/components/shared/user-message-analysis/cards';
	import { getUserMessageAnalysisColors } from '$conversations/pages/session/constants/user-message-analysis/colors';
	import { USER_MESSAGE_ANALYSIS_ICONS_MAP } from '$conversations/pages/session/constants/user-message-analysis/icons';
	import { highlightPopoverFloatingMiddlewares } from '../../../highlight-popover-floating-middleware';

	const {
		id,
		highlightType,
		highlightedText,
		analysis,
		disableHoverHighlight = false,
		showIconsInHighlightedParts
	}: AnalysisTextHighlightProps = $props();

	const cards = {
		MISTAKES: analysis?.mistakes?.find((m) => includesEitherWay(m.phrase, highlightedText)),
		STRENGTHS: analysis?.strengths?.find((s) => includesEitherWay(s.phrase, highlightedText)),
		SUGGESTIONS: analysis?.suggestions?.find((s) => includesEitherWay(s.original, highlightedText))
	} satisfies Record<MessageAnalysisCriteria, unknown>;

	const isMistakeCardAvailable = !isNil(cards.MISTAKES);
	const isStrengthCardAvailable = !isNil(cards.STRENGTHS);
	const isSuggestionCardAvailable = !isNil(cards.SUGGESTIONS);

	const moreThanOneCardAvailable =
		compact([
			isMistakeCardAvailable, //
			isStrengthCardAvailable,
			isSuggestionCardAvailable
		]).length >= 2;

	let activeCard = $state<MessageAnalysisCriteria>(highlightType);
	const activeCardColors = $derived(getUserMessageAnalysisColors(activeCard));

	const availableTabs = compact([
		isMistakeCardAvailable && {
			id: 'MISTAKES',
			label: 'Mistake', // TODO: i18n
			icon: USER_MESSAGE_ANALYSIS_ICONS_MAP['MISTAKES']
		},
		isSuggestionCardAvailable && {
			id: 'SUGGESTIONS',
			label: 'Suggestion', // TODO: i18n
			icon: USER_MESSAGE_ANALYSIS_ICONS_MAP['SUGGESTIONS']
		},
		isStrengthCardAvailable && {
			id: 'STRENGTHS',
			label: 'Strength', // TODO: i18n
			icon: USER_MESSAGE_ANALYSIS_ICONS_MAP['STRENGTHS']
		}
	]) satisfies Tab[];

	function handleMouseLeave() {
		activeCard = highlightType;
	}

	function handleHighlightClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		// Prevent text selection
		if (window.getSelection) {
			window.getSelection()?.removeAllRanges();
		}

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
		moreThanOneCardAvailable && !disableHoverHighlight ? 'cursor-pointer' : 'cursor-default'
	)}
	onclick={handleHighlightClick}
	onkeydown={handleHighlightKeydown}
	onmouseleave={handleMouseLeave}
	onblur={handleMouseLeave}
	onmousedown={(e) => e.preventDefault()}
	role="button"
	tabindex="0"
>
	{#if showIconsInHighlightedParts}
		{@const iconColor = activeCardColors.text}
		{@const iconSize = 'w-3 h-3'}

		<span class="inline-flex items-center gap-1 mx-0.5">
			{#if isMistakeCardAvailable}
				<AnalysisMetricIcon
					criteria="MISTAKES"
					class={cn(
						iconSize, //
						activeCard !== 'MISTAKES' ? 'opacity-60' : '',
						iconColor
					)}
				/>
			{/if}

			{#if isSuggestionCardAvailable}
				<AnalysisMetricIcon
					criteria="SUGGESTIONS"
					class={cn(
						iconSize, //
						activeCard !== 'SUGGESTIONS' ? 'opacity-60' : '',
						iconColor
					)}
				/>
			{/if}

			{#if isStrengthCardAvailable}
				<AnalysisMetricIcon
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

{#if !disableHoverHighlight}
	<Popover
		triggeredBy={`#${id}`}
		trigger="hover"
		middlewares={highlightPopoverFloatingMiddlewares}
		class={cn(
			'w-[800px] bg-white dark:bg-gray-800 shadow-lg border-2 rounded-lg',
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
				<AnalysisMetricIcon criteria={activeCard} class="w-4 h-4" />
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
			<MistakeCard mistake={cards.MISTAKES} isExpandable={false} />
		{:else if activeCard === 'SUGGESTIONS' && cards.SUGGESTIONS}
			<SuggestionCard suggestion={cards.SUGGESTIONS} isExpandable={false} />
		{:else if activeCard === 'STRENGTHS' && cards.STRENGTHS}
			<StrengthCard strength={cards.STRENGTHS} isExpandable={false} />
		{/if}
	</Popover>
{/if}
