<script lang="ts">
	import type { CompactConversationMessage } from '$lib/types/conversation/domain/conversation-message';
	import type { PhraseType, TipRegister } from '$lib/types/ongoing-conversation/api/responses';
	import { Briefcase, Inbox, Layers, SigmaIcon, Users, Zap } from 'lucide-svelte';
	import { DropdownSelect } from '$lib/components/forms/dropdown-select';
	import type { DropdownSelectOption } from '$lib/components/forms/dropdown-select';
	import type {
		CategoryCard,
		FilterableItem,
		FilterBase
	} from '../../shared/feedback-list-with-filters-base/types/utility-types';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import { getAiMessageLearningTipColorName } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import { PHRASE_TYPE_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/subcategory-icons';
	import FeedbackListWithFiltersBase from '../../shared/feedback-list-with-filters-base/feedback-list-with-filters-base.svelte';
	import {
		GrammarTipCard,
		PhraseTipCard,
		VocabularyTipCard
	} from '$lib/features/conversations/pages/session/components/shared/ai-message-learning-tips/cards';
	import type {
		AIMessageGrammarTip,
		AIMessageVocabularyTip,
		AIMessagePhraseTip
	} from '$lib/types/ongoing-conversation/api/responses';
	import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
	import {
		aggregateLearningTips,
		type AggregatedLearningTip
	} from './utils/aggregate-learning-tips';

	type Data = AggregatedLearningTip;
	type Category = LearningTipCategory | 'ALL';
	type Subcategory = PhraseType | null;
	type LearningTipsFilters = FilterBase<Category, Subcategory> & {
		register: TipRegister | 'ALL';
	};

	interface Props {
		data: CompactConversationMessage | CompactConversationMessage[];
	}

	const { data }: Props = $props();

	const defaultLearningTipsFilters: LearningTipsFilters = {
		category: 'ALL',
		subcategory: null,
		searchQuery: '',
		defaultExpandState: false,
		register: 'ALL'
	};

	let filters = $state<LearningTipsFilters>({ ...defaultLearningTipsFilters });

	const registerOptions: DropdownSelectOption<TipRegister | 'ALL'>[] = [
		{ label: 'All Registers', value: 'ALL', icon: Layers },
		{ label: 'Formal', value: 'FORMAL', icon: Briefcase },
		{ label: 'Neutral', value: 'NEUTRAL', icon: Users },
		{ label: 'Colloquial', value: 'COLLOQUIAL', icon: Zap }
	];

	function evaluateCustomFilters(
		item: FilterableItem<Data, Category, Subcategory>,
		f: LearningTipsFilters
	): boolean {
		if (f.register === 'ALL') return true;

		return item.data.register === f.register;
	}

	const aggregatedTips = $derived.by<FilterableItem<Data, Category, Subcategory>[]>(() => {
		return aggregateLearningTips(Array.isArray(data) ? data : [data]) //
			.map((tip) => {
				const subcategory: Subcategory = tip.type === 'PHRASES' ? tip.data.phraseType : null;

				return {
					data: tip,
					category: tip.type,
					subcategory,
					searchableText: tip.searchableText
				} satisfies FilterableItem<Data, Category, Subcategory>;
			});
	});

	const { categoriesCounter, subcategoriesCounter } = $derived.by(() => {
		const categoriesCounter: Record<Category, number> = {
			ALL: aggregatedTips.length,
			GRAMMAR: 0,
			VOCABULARY: 0,
			PHRASES: 0
		};

		const subcategoriesCounter: Record<NonNullable<Subcategory>, number> = {
			LITERAL: 0,
			IDIOMATIC: 0
		};

		for (const tip of aggregatedTips) {
			categoriesCounter[tip.category]++;

			if (tip.subcategory) {
				subcategoriesCounter[tip.subcategory]++;
			}
		}

		return { categoriesCounter, subcategoriesCounter };
	});

	const categories = $derived.by<CategoryCard<Category, Subcategory>[]>(() => {
		return [
			{
				id: 'ALL',
				title: 'Total',
				value: categoriesCounter.ALL,
				variant: 'primary',
				icon: SigmaIcon
			},

			{
				id: 'GRAMMAR',
				title: 'Grammar',
				value: categoriesCounter.GRAMMAR,
				variant: getAiMessageLearningTipColorName('GRAMMAR'),
				icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.GRAMMAR
			},

			{
				id: 'VOCABULARY',
				title: 'Vocabulary',
				value: categoriesCounter.VOCABULARY,
				variant: getAiMessageLearningTipColorName('VOCABULARY'),
				icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.VOCABULARY
			},

			{
				id: 'PHRASES',
				title: 'Phrases',
				value: categoriesCounter.PHRASES,
				variant: getAiMessageLearningTipColorName('PHRASES'),
				icon: AI_MESSAGE_LEARNING_TIP_ICONS_MAP.PHRASES,
				subcategories: [
					{
						id: 'LITERAL',
						title: 'Literal',
						value: subcategoriesCounter.LITERAL,
						icon: PHRASE_TYPE_ICONS_MAP.LITERAL
					},
					{
						id: 'IDIOMATIC',
						title: 'Idiomatic',
						value: subcategoriesCounter.IDIOMATIC,
						icon: PHRASE_TYPE_ICONS_MAP.IDIOMATIC
					}
				]
			}
		];
	});
</script>

<FeedbackListWithFiltersBase
	items={aggregatedTips}
	{categories}
	bind:filters
	defaultFilters={defaultLearningTipsFilters}
	{evaluateCustomFilters}
>
	{#snippet emptyNoData()}
		<Inbox
			class="size-12 text-gray-400 dark:text-gray-500 shrink-0"
			strokeWidth={1.25}
			aria-hidden="true"
		/>
		<div class="flex flex-col gap-2 max-w-sm">
			<h3 class="heading-5 text-gray-900 dark:text-gray-100">No learning tips yet</h3>
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Tips from the tutor will appear here when available for this message.
			</p>
		</div>
	{/snippet}
	{#snippet emptyFiltered()}
		<h3 class="heading-5 text-gray-900 dark:text-gray-100">No tips match your filters</h3>
		<p class="text-sm text-gray-600 dark:text-gray-400">
			Try changing or clearing your filters to see more items.
		</p>
	{/snippet}
	{#snippet customFilters()}
		<DropdownSelect
			value={filters.register}
			onValueChange={(v) => (filters.register = v as TipRegister | 'ALL')}
			options={registerOptions}
			ariaLabel="Filter by register"
			buttonClass="w-44 shrink-0"
			dropdownClass="w-44"
		/>
	{/snippet}

	{#snippet listItem({ item, defaultExpandState })}
		{#if item.data.type === 'GRAMMAR'}
			<GrammarTipCard tip={item.data.data as AIMessageGrammarTip} {defaultExpandState} />
		{:else if item.data.type === 'VOCABULARY'}
			<VocabularyTipCard tip={item.data.data as AIMessageVocabularyTip} {defaultExpandState} />
		{:else if item.data.type === 'PHRASES'}
			<PhraseTipCard tip={item.data.data as AIMessagePhraseTip} {defaultExpandState} />
		{/if}
	{/snippet}
</FeedbackListWithFiltersBase>
