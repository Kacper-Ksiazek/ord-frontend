import type { IconCardProps } from '$conversations/shared/components/icon-card';

export interface FilterableItem<
	TData,
	TCategory extends CategoryFilterBase = CategoryFilterBase,
	TSubcategory extends string | null = string | null
> {
	data: TData;
	category: TCategory;
	subcategory: TSubcategory;
	searchableText: string;
}

export type CategoryFilterBase = 'ALL' | string;

export interface CardBase extends Pick<IconCardProps, 'title' | 'value'> {
	icon: LucideIcon;
}

export interface SubcategoryCard<
	TSubcategory extends string | null = string | null
> extends CardBase {
	id: TSubcategory;
}

export interface CategoryCard<
	TCategory extends CategoryFilterBase = CategoryFilterBase,
	TSubcategory extends string | null = string | null
> extends CardBase {
	id: TCategory;
	variant: IconCardProps['variant'];
	subcategories?: SubcategoryCard<TSubcategory>[];
}

export interface FilterBase<
	TCategory extends CategoryFilterBase = CategoryFilterBase,
	TSubcategory extends string | null = string | null
> {
	category: TCategory;
	subcategory: TSubcategory;
	searchQuery: string;
	/** Whether cards start expanded or collapsed. Defaults to false (collapsed) when undefined. */
	defaultExpandState?: boolean;
}
