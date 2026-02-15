<script lang="ts">
	import isNil from 'lodash/isNil';
	import compact from 'lodash/compact';
	import type { LearningTipTextHighlightProps } from './learning-tip-text-highlight.types';
	import { includesEitherWay } from '$lib/utils/functions/includes-either-way';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import { cn, Popover } from 'flowbite-svelte';
	import { Tabs } from '$lib/components/navigation/tabs';
	import type { Tab } from '$lib/components/navigation/tabs';
	import {
		GrammarTipCard,
		VocabularyTipCard,
		PhraseTipCard
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
		PHRASES: learningTips?.phraseTips?.find((tip) => includesEitherWay(tip.phrase, highlightedText))
	} satisfies Record<LearningTipCategory, unknown>;

	const isGrammarTipAvailable = !isNil(cards.GRAMMAR);
	const isVocabularyTipAvailable = !isNil(cards.VOCABULARY);
	const isPhraseTipAvailable = !isNil(cards.PHRASES);

	const moreThanOneCardAvailable =
		compact([
			isGrammarTipAvailable, //
			isVocabularyTipAvailable,
			isPhraseTipAvailable
		]).length >= 2;

	let activeCard = $state<LearningTipCategory>(highlightType);
	const activeCardColors = $derived(getAiMessageLearningTipColors(activeCard));

	const GrammarIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP['GRAMMAR'];
	const VocabularyIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP['VOCABULARY'];
	const PhraseIcon = AI_MESSAGE_LEARNING_TIP_ICONS_MAP['PHRASES'];

	const availableTabs = compact([
		isVocabularyTipAvailable && { id: 'VOCABULARY', label: 'Vocabulary', icon: VocabularyIcon },
		isGrammarTipAvailable && { id: 'GRAMMAR', label: 'Grammar', icon: GrammarIcon },
		isPhraseTipAvailable && { id: 'PHRASES', label: 'Phrase', icon: PhraseIcon }
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
				} else if (isPhraseTipAvailable) {
					activeCard = 'PHRASES';
				}
				break;

			case 'VOCABULARY':
				if (isPhraseTipAvailable) {
					activeCard = 'PHRASES';
				} else if (isGrammarTipAvailable) {
					activeCard = 'GRAMMAR';
				}
				break;

			case 'PHRASES':
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
			} else if (activeCard === 'GRAMMAR' && isPhraseTipAvailable) {
				activeCard = 'PHRASES';
			} else if (activeCard === 'VOCABULARY' && isPhraseTipAvailable) {
				activeCard = 'PHRASES';
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
			{#if isVocabularyTipAvailable}
				<VocabularyIcon
					class={cn(
						'w-3 h-3',
						activeCard !== 'VOCABULARY' ? 'opacity-60' : '', //
						activeCardColors.iconColor
					)}
				/>
			{/if}

			{#if isGrammarTipAvailable}
				<GrammarIcon
					class={cn(
						'w-3 h-3',
						activeCard !== 'GRAMMAR' ? 'opacity-60' : '', //
						activeCardColors.iconColor
					)}
				/>
			{/if}

			{#if isPhraseTipAvailable}
				<PhraseIcon
					class={cn(
						'w-3 h-3',
						activeCard !== 'PHRASES' ? 'opacity-60' : '', //
						activeCardColors.iconColor
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
		'w-[500px] bg-white dark:bg-gray-800 shadow-lg border-2 rounded-lg',
		activeCardColors.cardBorder
	)}
	classes={{ content: 'p-2' }}
>
	{#if moreThanOneCardAvailable}
		<Tabs tabs={availableTabs} bind:activeTab={activeCard} activeColor="blue" class="mb-3" />
	{:else}
		<h3 class={cn('flex items-center gap-2 label-bold mb-2', activeCardColors.iconColor)}>
			{#if activeCard === 'GRAMMAR'}
				<GrammarIcon class="w-4 h-4" />
			{:else if activeCard === 'VOCABULARY'}
				<VocabularyIcon class="w-4 h-4" />
			{:else if activeCard === 'PHRASES'}
				<PhraseIcon class="w-4 h-4" />
			{/if}
			<span>
				{activeCard === 'GRAMMAR' ? 'Grammar' : activeCard === 'VOCABULARY' ? 'Vocabulary' : 'Phrase'}
			</span>
		</h3>
	{/if}

	{#if activeCard === 'GRAMMAR' && cards.GRAMMAR}
		<GrammarTipCard tip={cards.GRAMMAR} />
	{:else if activeCard === 'VOCABULARY' && cards.VOCABULARY}
		<VocabularyTipCard tip={cards.VOCABULARY} />
	{:else if activeCard === 'PHRASES' && cards.PHRASES}
		<PhraseTipCard tip={cards.PHRASES} />
	{/if}
</Popover>
