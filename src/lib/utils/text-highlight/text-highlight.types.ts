export interface HighlightPart<TCategory extends string | number | symbol> {
	text: string;
	highlight?: TCategory;
}

export interface TextCategoryPair<TCategory extends string | number | symbol> {
	text: string;
	category: TCategory;
}

export interface HighlightRange<TCategory extends string | number | symbol> {
	start: number;
	end: number;
	category: TCategory;
	text: string;
}
