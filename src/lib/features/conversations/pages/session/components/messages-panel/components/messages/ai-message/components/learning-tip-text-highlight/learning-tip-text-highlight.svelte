<script lang="ts">
	import isNil from 'lodash/isNil';
	import compact from 'lodash/compact';
	import type { LearningTipTextHighlightProps } from './learning-tip-text-highlight.types';
	import { includesEitherWay } from '$lib/utils/functions/includes-either-way';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import { cn, Tooltip } from 'flowbite-svelte';
	import { Tabs } from '$lib/components/tabs';
	import type { Tab } from '$lib/components/tabs';
	import {
		GrammarTipCard,
		VocabularyTipCard,
		IdiomTipCard
	} from '$lib/features/conversations/pages/session/components/shared/ai-message-learning-tips/cards';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/icons';
	import { getAiMessageLearningTipColors } from '$lib/features/conversations/pages/session/consts/ai-message-learning-tips/colors';

	const {
		id,
		highlightType,
		highlightedText,
		learningTips,
		showIconsInHighlightedParts
	}: LearningTipTextHighlightProps = $props();

	const cards = {
		GRAMMAR: learningTips?.grammarTips?.find((tip) => includesEitherWay(tip.phrase, highlightedText)),
		VOCABULARY: learningTips?.vocabularyTips?.find((tip) =>
			includesEitherWay(tip.word, highlightedText)
		),
		IDIOMS: learningTips?.idiomTips?.find((tip) => includesEitherWay(tip.phrase, highlightedText))
	} satisfies Record<LearningTipCategory, unknown>;

	const isGrammarTipAvailable = !isNil(cards.GRAMMAR);
	const isVocabularyTipAvailable = !isNil(cards.VOCABULARY);
	const isIdiomTipAvailable = !isNil(cards.IDIOMS);

	const moreThanOneCardAvailable =
		compact([
			isGrammarTipAvailable, //
			isVocabularyTipAvailable,
			isIdiomTipAvailable
		]).length >= 2;

	let activeCard = $state<LearningTipCategory>(highlightType);
	const activeCardColors = $derived(getAiMessageLearningTipColors(activeCard));

	const GrammarIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP['GRAMMAR'];
	const VocabularyIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP['VOCABULARY'];
	const IdiomIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP['IDIOMS'];

	const availableTabs = compact([
		isGrammarTipAvailable && { id: 'GRAMMAR', label: 'Grammar', icon: GrammarIcon },
		isVocabularyTipAvailable && { id: 'VOCABULARY', label: 'Vocabulary', icon: VocabularyIcon },
		isIdiomTipAvailable && { id: 'IDIOMS', label: 'Idiom', icon: IdiomIcon }
	]) satisfies Tab[];

	function handleMouseLeave() {
		activeCard = highlightType;
	}

	function handleHighlightClick(e: MouseEvent) {
		e.preventDefault();
		e.stopPropagation();

		switch (activeCard) {
			case 'GRAMMAR':
				if (isVocabularyTipAvailable) {
					activeCard = 'VOCABULARY';
				} else if (isIdiomTipAvailable) {
					activeCard = 'IDIOMS';
				}
				break;

			case 'VOCABULARY':
				if (isIdiomTipAvailable) {
					activeCard = 'IDIOMS';
				} else if (isGrammarTipAvailable) {
					activeCard = 'GRAMMAR';
				}
				break;

			case 'IDIOMS':
				if (isGrammarTipAvailable) {
					activeCard = 'GRAMMAR';
				} else if (isVocabularyTipAvailable) {
					activeCard = 'VOCABULARY';
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
			if (activeCard === 'GRAMMAR' && isVocabularyTipAvailable) {
				activeCard = 'VOCABULARY';
			} else if (activeCard === 'GRAMMAR' && isIdiomTipAvailable) {
				activeCard = 'IDIOMS';
			} else if (activeCard === 'VOCABULARY' && isIdiomTipAvailable) {
				activeCard = 'IDIOMS';
			} else {
				return;
			}

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
		<span class="inline-flex items-center gap-1 mx-1">
			{#if isGrammarTipAvailable}
				<GrammarIcon
					class={cn(
						'w-3 h-3',
						activeCard !== 'GRAMMAR' ? 'opacity-60' : '', //
						activeCardColors.iconColor
					)}
				/>
			{/if}

			{#if isVocabularyTipAvailable}
				<VocabularyIcon
					class={cn(
						'w-3 h-3',
						activeCard !== 'VOCABULARY' ? 'opacity-60' : '', //
						activeCardColors.iconColor
					)}
				/>
			{/if}

			{#if isIdiomTipAvailable}
				<IdiomIcon
					class={cn(
						'w-3 h-3',
						activeCard !== 'IDIOMS' ? 'opacity-60' : '', //
						activeCardColors.iconColor
					)}
				/>
			{/if}
		</span>
	{/if}

	{highlightedText}
</span>

<Tooltip
	triggeredBy={`#${id}`}
	class={cn(
		'bg-white dark:bg-gray-800 shadow-lg border-2 rounded-lg select-none',
		activeCardColors.cardBorder
	)}
>
	<div class="p-2 w-[500px]">
		{#if moreThanOneCardAvailable}
			<Tabs tabs={availableTabs} bind:activeTab={activeCard} activeColor="blue" class="mb-3" />
		{:else}
			<h3 class={cn('flex items-center gap-2 text-sm font-semibold mb-2', activeCardColors.iconColor)}>
				{#if activeCard === 'GRAMMAR'}
					<GrammarIcon class="w-4 h-4" />
				{:else if activeCard === 'VOCABULARY'}
					<VocabularyIcon class="w-4 h-4" />
				{:else if activeCard === 'IDIOMS'}
					<IdiomIcon class="w-4 h-4" />
				{/if}
				<span>
					{activeCard === 'GRAMMAR' ? 'Grammar' : activeCard === 'VOCABULARY' ? 'Vocabulary' : 'Idiom'}
				</span>
			</h3>
		{/if}

		{#if activeCard === 'GRAMMAR' && cards.GRAMMAR}
			<GrammarTipCard tip={cards.GRAMMAR} />
		{:else if activeCard === 'VOCABULARY' && cards.VOCABULARY}
			<VocabularyTipCard tip={cards.VOCABULARY} />
		{:else if activeCard === 'IDIOMS' && cards.IDIOMS}
			<IdiomTipCard tip={cards.IDIOMS} />
		{/if}
	</div>
</Tooltip>
