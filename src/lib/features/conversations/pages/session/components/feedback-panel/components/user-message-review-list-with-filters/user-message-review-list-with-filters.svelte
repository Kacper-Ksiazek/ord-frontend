<script lang="ts">
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import type {
		ConversationMessageMistakeSeverity,
		ConversationMessageSuggestionType
	} from '$lib/types/conversation/domain/conversation-message-analysis';
	import type { MessageAnalysisCriteria } from '$lib/types/conversation/domain/message-analysis-criteria';
	import { Inbox, SigmaIcon } from 'lucide-svelte';
	import type {
		CategoryCard,
		FilterableItem,
		FilterBase
	} from '../../shared/analysis-list-with-filters-base/types/utility-types';
	import { aggregateAnalysis, type AggregatedAnalysisItem } from './utils/aggregate-analysis';
	import { USER_MESSAGE_ANALYSIS_ICONS_MAP } from '$conversations/pages/session/constants/user-message-analysis/icons';
	import { getUserMessageAnalysisColorName } from '$conversations/pages/session/constants/user-message-analysis/colors';
	import {
		MISTAKE_SEVERITY_ICONS_MAP,
		SUGGESTION_TYPE_ICONS_MAP
	} from '$conversations/pages/session/constants/user-message-analysis/subcategory-icons';
	import AnalysisListWithFiltersBase from '../../shared/analysis-list-with-filters-base/analysis-list-with-filters-base.svelte';
	import {
		MistakeCard,
		StrengthCard,
		SuggestionCard
	} from '$lib/features/conversations/pages/session/components/shared/user-message-analysis/cards';
	import type {
		ConversationMessageMistake,
		ConversationMessageStrength,
		ConversationMessageSuggestion
	} from '$lib/types/conversation/domain/conversation-message-analysis';

	type Data = AggregatedAnalysisItem;
	type Category = MessageAnalysisCriteria | 'ALL';
	type Subcategory = ConversationMessageMistakeSeverity | ConversationMessageSuggestionType | null;

	interface Props {
		data: CompactConversationUserMessage | CompactConversationUserMessage[];
	}

	const { data }: Props = $props();

	let filters = $state<FilterBase<Category, Subcategory>>({
		category: 'ALL',
		subcategory: null,
		searchQuery: '',
		defaultExpandState: false
	});

	const aggregatedAnalyses = $derived.by<FilterableItem<Data, Category, Subcategory>[]>(() => {
		return aggregateAnalysis(Array.isArray(data) ? data : [data]) //
			.map((item: AggregatedAnalysisItem) => {
				const subcategory: Subcategory = (() => {
					if (item.type === 'MISTAKES') {
						return item.data.severity;
					}
					if (item.type === 'SUGGESTIONS') {
						return item.data.suggestionType;
					}

					return null;
				})();

				const searchableText = `${item.phrase} ${item.explanation}`.toLowerCase();

				return {
					data: item,
					category: item.type,
					subcategory,
					searchableText
				} satisfies FilterableItem<Data, Category, Subcategory>;
			});
	});

	const { categoriesCounter, subcategoriesCounter } = $derived.by(() => {
		const categoriesCounter: Record<Category, number> = {
			ALL: aggregatedAnalyses.length,
			MISTAKES: 0,
			STRENGTHS: 0,
			SUGGESTIONS: 0
		};

		const subcategoriesCounter: Record<NonNullable<Subcategory>, number> = {
			MINOR: 0,
			MODERATE: 0,
			CRITICAL: 0,
			VOCABULARY: 0,
			STRUCTURE: 0
		};

		for (const item of aggregatedAnalyses) {
			categoriesCounter[item.category]++;

			if (item.subcategory) {
				subcategoriesCounter[item.subcategory]++;
			}
		}

		return { categoriesCounter, subcategoriesCounter };
	});

	const categories = $derived.by<CategoryCard<Category, Subcategory>[]>(() => {
		return [
			{
				id: 'ALL',
				title: 'All',
				value: categoriesCounter.ALL,
				variant: 'primary',
				icon: SigmaIcon
			},

			{
				id: 'MISTAKES',
				title: 'Mistakes',
				value: categoriesCounter.MISTAKES,
				variant: getUserMessageAnalysisColorName('MISTAKES'),
				icon: USER_MESSAGE_ANALYSIS_ICONS_MAP.MISTAKES,
				subcategories: [
					{
						id: 'MINOR',
						title: 'Minor',
						value: subcategoriesCounter.MINOR,
						icon: MISTAKE_SEVERITY_ICONS_MAP.MINOR
					},
					{
						id: 'MODERATE',
						title: 'Moderate',
						value: subcategoriesCounter.MODERATE,
						icon: MISTAKE_SEVERITY_ICONS_MAP.MODERATE
					},
					{
						id: 'CRITICAL',
						title: 'Critical',
						value: subcategoriesCounter.CRITICAL,
						icon: MISTAKE_SEVERITY_ICONS_MAP.CRITICAL
					}
				]
			},

			{
				id: 'STRENGTHS',
				title: 'Strengths',
				value: categoriesCounter.STRENGTHS,
				variant: getUserMessageAnalysisColorName('STRENGTHS'),
				icon: USER_MESSAGE_ANALYSIS_ICONS_MAP.STRENGTHS
			},

			{
				id: 'SUGGESTIONS',
				title: 'Suggestions',
				value: categoriesCounter.SUGGESTIONS,
				variant: getUserMessageAnalysisColorName('SUGGESTIONS'),
				icon: USER_MESSAGE_ANALYSIS_ICONS_MAP.SUGGESTIONS,
				subcategories: [
					{
						id: 'VOCABULARY',
						title: 'Vocabulary',
						value: subcategoriesCounter.VOCABULARY,
						icon: SUGGESTION_TYPE_ICONS_MAP.VOCABULARY
					},
					{
						id: 'STRUCTURE',
						title: 'Structure',
						value: subcategoriesCounter.STRUCTURE,
						icon: SUGGESTION_TYPE_ICONS_MAP.STRUCTURE
					}
				]
			}
		];
	});
</script>

<AnalysisListWithFiltersBase items={aggregatedAnalyses} {categories} bind:filters>
	{#snippet emptyNoData()}
		<Inbox
			class="size-12 text-gray-400 dark:text-gray-500 shrink-0"
			strokeWidth={1.25}
			aria-hidden="true"
		/>
		<div class="flex flex-col gap-2 max-w-sm">
			<h3 class="heading-5 text-gray-900 dark:text-gray-100">No analysis yet</h3>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Corrections, strengths, and suggestions will show here when available for this message.
			</p>
		</div>
	{/snippet}
	{#snippet emptyFiltered()}
		<h3 class="heading-5 text-gray-900 dark:text-gray-100">No analysis matches your filters</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Try changing or clearing your filters to see more items.
		</p>
	{/snippet}
	{#snippet listItem({ item, defaultExpandState })}
		{#if item.data.type === 'MISTAKES'}
			<MistakeCard mistake={item.data.data as ConversationMessageMistake} {defaultExpandState} />
		{:else if item.data.type === 'STRENGTHS'}
			<StrengthCard strength={item.data.data as ConversationMessageStrength} {defaultExpandState} />
		{:else if item.data.type === 'SUGGESTIONS'}
			<SuggestionCard
				suggestion={item.data.data as ConversationMessageSuggestion}
				{defaultExpandState}
			/>
		{/if}
	{/snippet}
</AnalysisListWithFiltersBase>
