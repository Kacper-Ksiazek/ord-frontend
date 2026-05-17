import type { AnalysisListWithFiltersBaseProps } from '../types/props';
import type { FilterableItem, FilterBase, CategoryFilterBase } from '../types/utility-types';

function evaluateDefaultFilters<
	TCategory extends CategoryFilterBase,
	TSubcategory extends string | null
>(
	item: FilterableItem<unknown, TCategory, TSubcategory>,
	filters: FilterBase<TCategory, TSubcategory>
): boolean {
	const { category, subcategory, searchQuery } = filters;

	if (category !== 'ALL') {
		if (item.category !== category) {
			return false;
		}
	}

	if (subcategory !== null && subcategory !== 'ALL') {
		if (item.subcategory !== subcategory) {
			return false;
		}
	}

	if (searchQuery.trim() !== '') {
		return item.searchableText.includes(searchQuery.trim().toLowerCase());
	}

	return true;
}

export function applyFilters<
	TData,
	TCategory extends CategoryFilterBase,
	TSubcategory extends string | null,
	TFilters extends FilterBase<TCategory, TSubcategory>
>({
	evaluateCustomFilters,
	items,
	filters
}: Pick<
	AnalysisListWithFiltersBaseProps<TData, TCategory, TSubcategory, TFilters>,
	'evaluateCustomFilters' | 'items' | 'filters'
>): FilterableItem<TData, TCategory, TSubcategory>[] {
	return items.filter((item) => {
		const passesDefaultFilters = evaluateDefaultFilters(item, filters);

		const passesCustomFilters = evaluateCustomFilters ? evaluateCustomFilters(item, filters) : true;

		return passesDefaultFilters && passesCustomFilters;
	});
}
