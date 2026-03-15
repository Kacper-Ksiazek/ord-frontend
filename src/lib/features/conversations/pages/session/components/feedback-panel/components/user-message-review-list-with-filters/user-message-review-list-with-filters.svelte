<script lang="ts">
	import type { CompactConversationUserMessage } from '$lib/types/conversation/domain/conversation-message';
	import type {
		ConversationMessageMistakeSeverity,
		ConversationMessageSuggestionType
	} from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';
	import { SigmaIcon } from 'lucide-svelte';
	import type {
		CategoryCard,
		FilterableItem,
		FilterBase
	} from '../feedback-list-with-filters-base/types/utility-types';
	import { aggregateFeedback } from './utils/aggregate-feedback';
	import { USER_MESSAGE_FEEDBACK_ICONS_MAP } from '$conversations/pages/session/constants/user-message-feedback/icons';
	import { getUserMessageFeedbackColorName } from '$conversations/pages/session/constants/user-message-feedback/colors';
	import {
		MISTAKE_SEVERITY_ICONS_MAP,
		SUGGESTION_TYPE_ICONS_MAP
	} from '$conversations/pages/session/constants/user-message-feedback/subcategory-icons';
	import FeedbackListWithFiltersBase from '../feedback-list-with-filters-base/feedback-list-with-filters-base.svelte';
	import {
		MistakeCard,
		StrengthCard,
		SuggestionCard
	} from '$lib/features/conversations/pages/session/components/shared/user-message-feedback/cards';
	import type {
		ConversationMessageMistake,
		ConversationMessageStrength,
		ConversationMessageSuggestion
	} from '$lib/types/conversation/domain/conversation-message-feedback';
	import type { AggregatedFeedbackItem } from './utils/aggregate-feedback';

	type Data = AggregatedFeedbackItem;
	type Category = MessageFeedbackCriteria | 'ALL';
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

	const aggregatedFeedbacks = $derived.by<FilterableItem<Data, Category, Subcategory>[]>(() => {
		return aggregateFeedback(Array.isArray(data) ? data : [data]) //
			.map((feedback: AggregatedFeedbackItem) => {
				const subcategory: Subcategory = (() => {
					if (feedback.type === 'MISTAKES') {
						return feedback.data.severity;
					}
					if (feedback.type === 'SUGGESTIONS') {
						return feedback.data.suggestionType;
					}

					return null;
				})();

				const searchableText = `${feedback.phrase} ${feedback.explanation}`.toLowerCase();

				return {
					data: feedback,
					category: feedback.type,
					subcategory,
					searchableText
				} satisfies FilterableItem<Data, Category, Subcategory>;
			});
	});

	const { categoriesCounter, subcategoriesCounter } = $derived.by(() => {
		const categoriesCounter: Record<Category, number> = {
			ALL: aggregatedFeedbacks.length,
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

		for (const feedback of aggregatedFeedbacks) {
			categoriesCounter[feedback.category]++;

			if (feedback.subcategory) {
				subcategoriesCounter[feedback.subcategory]++;
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
				variant: getUserMessageFeedbackColorName('MISTAKES'),
				icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.MISTAKES,
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
				variant: getUserMessageFeedbackColorName('STRENGTHS'),
				icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.STRENGTHS
			},

			{
				id: 'SUGGESTIONS',
				title: 'Suggestions',
				value: categoriesCounter.SUGGESTIONS,
				variant: getUserMessageFeedbackColorName('SUGGESTIONS'),
				icon: USER_MESSAGE_FEEDBACK_ICONS_MAP.SUGGESTIONS,
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

<FeedbackListWithFiltersBase items={aggregatedFeedbacks} {categories} bind:filters>
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
</FeedbackListWithFiltersBase>
