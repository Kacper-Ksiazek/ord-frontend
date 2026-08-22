<script lang="ts">
	import isNil from 'lodash/isNil';
	import compact from 'lodash/compact';
	import type { AnalysisTextHighlightProps } from './analysis-text-highlight.types';
	import { includesEitherWay } from '$lib/utils/functions/includes-either-way';
	import type { MessageAnalysisCriteria } from '$conversations/types';
	import { Popover } from 'bits-ui';
	import { cn } from '$lib/utils/cn';
	import AnalysisMetricIcon from '$conversations/pages/session/components/shared/user-message-analysis/user-message-analysis-metric-icon.svelte';
	import type { Tab } from '$lib/components/navigation/tabs';
	import {
		MistakeCard,
		StrengthCard,
		SuggestionCard
	} from '$conversations/pages/session/components/shared/user-message-analysis/cards';
	import { getUserMessageAnalysisColors } from '$conversations/pages/session/constants/user-message-analysis/colors';
	import { USER_MESSAGE_ANALYSIS_ICONS_MAP } from '$conversations/pages/session/constants/user-message-analysis/icons';

	const {
		id,
		highlightType,
		highlightedText,
		analysis,
		disableHoverHighlight = false
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
	const highlightIconColor = $derived(activeCardColors.iconColor);

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
	]) satisfies Tab<MessageAnalysisCriteria>[];

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

<Popover.Root>
	<Popover.Trigger openOnHover={!disableHoverHighlight} openDelay={150} closeDelay={120}>
		{#snippet child({ props })}
			<span
				{...props}
				{id}
				class={cn(
					String(props.class ?? ''),
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
				<span class="mx-0.5 inline-flex items-center gap-1">
					{#if isMistakeCardAvailable}
						<AnalysisMetricIcon
							criteria="MISTAKES"
							class={cn('h-3 w-3', activeCard !== 'MISTAKES' ? 'opacity-60' : '', highlightIconColor)}
						/>
					{/if}

					{#if isSuggestionCardAvailable}
						<AnalysisMetricIcon
							criteria="SUGGESTIONS"
							class={cn('h-3 w-3', activeCard !== 'SUGGESTIONS' ? 'opacity-60' : '', highlightIconColor)}
						/>
					{/if}

					{#if isStrengthCardAvailable}
						<AnalysisMetricIcon
							criteria="STRENGTHS"
							class={cn('h-3 w-3', activeCard !== 'STRENGTHS' ? 'opacity-60' : '', highlightIconColor)}
						/>
					{/if}
				</span>
				{highlightedText}
			</span>
		{/snippet}
	</Popover.Trigger>

	{#if !disableHoverHighlight}
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
						<AnalysisMetricIcon criteria={activeCard} class="h-3.5 w-3.5 text-ink-muted" />
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
			</Popover.Content>
		</Popover.Portal>
	{/if}
</Popover.Root>
