<script lang="ts">
	import isNil from 'lodash/isNil';
	import compact from 'lodash/compact';
	import type { LearningTipTextHighlightProps } from './learning-tip-text-highlight.types';
	import { includesEitherWay } from '$lib/utils/functions/includes-either-way';
	import type { LearningTipCategory } from '$conversations/types';
	import { Popover } from 'bits-ui';
	import { cn } from '$lib/utils/cn';
	import type { Tab } from '$lib/components/navigation/tabs';
	import {
		GrammarTipCard,
		VocabularyTipCard,
		PhraseTipCard
	} from '$conversations/pages/session/components/shared/ai-message-learning-tips/cards';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import { getAiMessageLearningTipColors } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';

	const { id, highlightType, highlightedText, learningTips }: LearningTipTextHighlightProps =
		$props();

	const cards = {
		GRAMMAR: learningTips?.grammarTips?.find((tip) =>
			includesEitherWay(tip.phrase ?? '', highlightedText)
		),
		VOCABULARY: learningTips?.vocabularyTips?.find((tip) =>
			includesEitherWay(tip.word ?? '', highlightedText)
		),
		PHRASES: learningTips?.phraseTips?.find((tip) =>
			includesEitherWay(tip.phrase ?? '', highlightedText)
		)
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
	]) satisfies Tab<LearningTipCategory>[];

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

<Popover.Root>
	<Popover.Trigger openOnHover openDelay={150} closeDelay={120}>
		{#snippet child({ props })}
			<span
				{...props}
				{id}
				class={cn(
					String(props.class ?? ''),
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
				<span class="mx-0.5 inline-flex items-center gap-1">
					{#if isVocabularyTipAvailable}
						<VocabularyIcon
							class={cn(
								'h-3 w-3',
								activeCard !== 'VOCABULARY' ? 'opacity-60' : '',
								activeCardColors.iconColor
							)}
						/>
					{/if}

					{#if isGrammarTipAvailable}
						<GrammarIcon
							class={cn(
								'h-3 w-3',
								activeCard !== 'GRAMMAR' ? 'opacity-60' : '',
								activeCardColors.iconColor
							)}
						/>
					{/if}

					{#if isPhraseTipAvailable}
						<PhraseIcon
							class={cn(
								'h-3 w-3',
								activeCard !== 'PHRASES' ? 'opacity-60' : '',
								activeCardColors.iconColor
							)}
						/>
					{/if}
				</span>

				{highlightedText}
			</span>
		{/snippet}
	</Popover.Trigger>

	<Popover.Portal>
		<Popover.Content
			class="overlay-surface z-50 w-[min(28rem,calc(100vw-2rem))] p-3"
			collisionPadding={12}
			sideOffset={8}
		>
			{#if moreThanOneCardAvailable}
				<div class="-mx-3 mb-3 flex items-center gap-4 border-b border-line px-3">
					{#each availableTabs as tab (tab.id)}
						<button
							type="button"
							onclick={() => (activeCard = tab.id)}
							class={cn(
								'-mb-px flex items-center gap-1.5 border-b-2 pb-2 text-xs font-medium',
								activeCard === tab.id
									? 'border-ink text-ink'
									: 'border-transparent text-ink-muted hover:text-ink'
							)}
						>
							{#if tab.icon}
								<tab.icon class="h-3.5 w-3.5" />
							{/if}
							{tab.label}
						</button>
					{/each}
				</div>
			{:else}
				<h3
					class="-mx-3 mb-3 flex items-center gap-1.5 border-b border-line px-3 pb-2 text-xs font-medium text-ink"
				>
					{#if activeCard === 'GRAMMAR'}
						<GrammarIcon class="h-3.5 w-3.5 text-ink-muted" />
					{:else if activeCard === 'VOCABULARY'}
						<VocabularyIcon class="h-3.5 w-3.5 text-ink-muted" />
					{:else if activeCard === 'PHRASES'}
						<PhraseIcon class="h-3.5 w-3.5 text-ink-muted" />
					{/if}
					<span>
						{activeCard === 'GRAMMAR' ? 'Grammar' : activeCard === 'VOCABULARY' ? 'Vocabulary' : 'Phrase'}
					</span>
				</h3>
			{/if}

			{#if activeCard === 'GRAMMAR' && cards.GRAMMAR}
				<GrammarTipCard tip={cards.GRAMMAR} isExpandable={false} />
			{:else if activeCard === 'VOCABULARY' && cards.VOCABULARY}
				<VocabularyTipCard tip={cards.VOCABULARY} isExpandable={false} />
			{:else if activeCard === 'PHRASES' && cards.PHRASES}
				<PhraseTipCard tip={cards.PHRASES} isExpandable={false} />
			{/if}
		</Popover.Content>
	</Popover.Portal>
</Popover.Root>
