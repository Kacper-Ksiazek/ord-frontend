<script lang="ts">
	import isEmpty from 'lodash/isEmpty';
	import ScrollableWrapper from '$lib/components/scrollable-wrapper.svelte';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import {
		GrammarTipCard,
		VocabularyTipCard,
		PhraseTipCard
	} from '../../../../../shared/ai-message-learning-tips/cards';
	import { getMessagesContext } from '$conversations/pages/session/contexts/messages-context.svelte';
	import { aggregateLearningTips, countLearningTips } from './utils';
	import type { LearningTipsTabFilters } from './learning-tips-tab.types';
	import { filterLearningTips } from './utils/filter-learning-tips';
	import RegisterFilter from './components/register-filter.svelte';
	import { LearningTipStatCard } from './components/learning-tip-stat-card';
	import type { LearningTipStatCardProps } from './components/learning-tip-stat-card/learning-tip-stat-card.types';
	import Input from '$lib/components/forms/input/input.svelte';
	import { MessageSquareOffIcon, SearchIcon, TrashIcon } from 'lucide-svelte';
	import { IconButton } from '$lib/components/buttons/icon-button';
	import { Button } from '$lib/components/buttons/button';

	const messagesContext = getMessagesContext();
	const messages = $derived(messagesContext.messages);

	const allAvailableLearningTips = $derived(aggregateLearningTips(messages));

	let scrollContainer = $state<HTMLDivElement | undefined>(undefined);

	let filters = $state<LearningTipsTabFilters>({
		register: 'ALL',
		tab: 'ALL',
		searchQuery: ''
	});

	const tipsToRender = $derived(filterLearningTips(allAvailableLearningTips, filters));

	const areFiltersClearable = $derived(
		filters.register !== 'ALL' || filters.searchQuery.trim() !== ''
	);

	const learningTipsCounts = $derived(
		countLearningTips(
			filterLearningTips(allAvailableLearningTips, {
				...filters,
				tab: 'ALL'
			})
		)
	);

	function selectTab(tabId: LearningTipCategory | 'ALL') {
		filters.tab = tabId;

		if (scrollContainer) {
			scrollContainer.scrollTop = 0;
		}
	}

	const learningTipCards = $derived<Pick<LearningTipStatCardProps, 'count' | 'tabId'>[]>([
		{
			tabId: 'ALL',
			count: learningTipsCounts.values().reduce((acc, value) => acc + value, 0)
		},
		{
			tabId: 'GRAMMAR',
			count: learningTipsCounts.get('GRAMMAR') ?? 0
		},
		{
			tabId: 'VOCABULARY',
			count: learningTipsCounts.get('VOCABULARY') ?? 0
		},
		{
			tabId: 'PHRASES',
			count: learningTipsCounts.get('PHRASES') ?? 0
		}
	]);
</script>

<div class="flex justify-between items-center gap-2 mb-4">
	{#each learningTipCards as card}
		<LearningTipStatCard
			count={card.count}
			tabId={card.tabId}
			isCardActive={filters.tab === card.tabId}
			onSelect={() => selectTab(card.tabId)}
		/>
	{/each}
</div>

<div class="flex items-center gap-3 mb-4">
	<Input
		bind:value={filters.searchQuery}
		placeholder="Search tips..."
		class="flex-1"
		leftAdornment={SearchIcon}
	/>

	<RegisterFilter bind:value={filters.register} />

	<IconButton
		onClick={() => {
			filters.register = 'ALL';
			filters.searchQuery = '';
		}}
		icon={TrashIcon}
		ariaLabel="Clear filters"
		tooltip="Clear filters"
		disabled={!areFiltersClearable}
		variant={areFiltersClearable ? 'DELETE' : 'TEXT'}
		type="OUTLINED"
	/>
</div>

{#if !isEmpty(allAvailableLearningTips)}
	<ScrollableWrapper wrapperClass="min-h-0" contentClass="px-0" bind:scrollContainer>
		{#snippet children()}
			{#if !isEmpty(tipsToRender)}
				<div class="space-y-4">
					{#each tipsToRender as tip}
						{#if tip.type === 'GRAMMAR'}
							<GrammarTipCard tip={tip.data} />
						{:else if tip.type === 'VOCABULARY'}
							<VocabularyTipCard tip={tip.data} />
						{:else if tip.type === 'PHRASES'}
							<PhraseTipCard tip={tip.data} />
						{/if}
					{/each}
				</div>
			{:else}
				<div class="flex-1 flex flex-col items-center justify-center h-full text-muted">
					<MessageSquareOffIcon class="w-16 h-16 opacity-20" />
					<p class="text-muted-small text-center py-4">No learning tips to show for current filters.</p>

					<Button
						variant="DELETE"
						type="OUTLINED"
						onClick={() => {
							filters.register = 'ALL';
							filters.searchQuery = '';
						}}
						class="mt-4"
					>
						<TrashIcon class="w-4 h-4" />
						<span> Clear filters</span>
					</Button>
				</div>
			{/if}
		{/snippet}
	</ScrollableWrapper>
{:else}
	<div class="text-center py-8 text-muted flex-1 flex items-center justify-center">
		<p>No learning tips available yet.</p>
	</div>
{/if}
