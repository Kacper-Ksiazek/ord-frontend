import type { Snippet } from 'svelte';
import type { FilterableItem, CategoryFilterBase, CategoryCard, FilterBase } from './utility-types';

export interface FeedbackListWithFiltersBaseProps<
	TData,
	TCategory extends CategoryFilterBase = CategoryFilterBase,
	TSubcategory extends string | null = string | null,
	TFilters extends FilterBase<TCategory, TSubcategory> = FilterBase<TCategory, TSubcategory>
> {
	items: FilterableItem<TData, TCategory, TSubcategory>[];
	categories: CategoryCard<TCategory, TSubcategory>[];
	filters: TFilters;

	defaultFilters?: TFilters;
	areFiltersClearable?: boolean;
	customFilters?: Snippet;
	evaluateCustomFilters?: (
		item: FilterableItem<TData, TCategory, TSubcategory>,
		filters: TFilters
	) => boolean;

	listItem: Snippet<[{ item: FilterableItem<TData, TCategory, TSubcategory> }]>;
}
