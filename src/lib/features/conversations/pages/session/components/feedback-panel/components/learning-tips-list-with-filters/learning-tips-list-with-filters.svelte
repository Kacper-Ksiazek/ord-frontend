<script lang="ts">
	import type { CompactConversationMessage } from '$lib/types/conversation/domain/conversation-message';
	import type { PhraseType } from '$lib/types/ongoing-conversation/api/responses';
	import { SigmaIcon } from 'lucide-svelte';
	import type {
		CategoryCard,
		FilterableItem,
		FilterBase
	} from '../feedback-list-with-filters-base/types/utility-types';
	import { AI_MESSAGE_LEARNING_TIP_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/icons';
	import { getAiMessageLearningTipColorName } from '$conversations/pages/session/constants/ai-message-learning-tips/colors';
	import { PHRASE_TYPE_ICONS_MAP } from '$conversations/pages/session/constants/ai-message-learning-tips/subcategory-icons';
	import FeedbackListWithFiltersBase from '../feedback-list-with-filters-base/feedback-list-with-filters-base.svelte';
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

	interface Props {
		data: CompactConversationMessage | CompactConversationMessage[];
	}

	const { data }: Props = $props();

	let filters = $state<FilterBase<Category, Subcategory>>({
		category: 'ALL',
		subcategory: null,
		searchQuery: ''
	});

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

<FeedbackListWithFiltersBase items={aggregatedTips} {categories} bind:filters>
	{#snippet listItem({ item })}
		{#if item.data.type === 'GRAMMAR'}
			<GrammarTipCard tip={item.data.data as AIMessageGrammarTip} />
		{:else if item.data.type === 'VOCABULARY'}
			<VocabularyTipCard tip={item.data.data as AIMessageVocabularyTip} />
		{:else if item.data.type === 'PHRASES'}
			<PhraseTipCard tip={item.data.data as AIMessagePhraseTip} />
		{/if}
	{/snippet}
</FeedbackListWithFiltersBase>
