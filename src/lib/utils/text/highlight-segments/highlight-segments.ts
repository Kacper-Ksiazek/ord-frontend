import isEmpty from 'lodash/isEmpty';
import flatMap from 'lodash/flatMap';
import type { HighlightPart, TextCategoryPair } from './highlight-segments.types';
import { findTextRanges, mergeRanges, buildHighlightParts } from './highlight-segments.utils';

/** Highlights text fragments in content based on text-category pairs */
export function highlightText<TCategory extends string | number | symbol>(
	content: string,
	highlights: Array<TextCategoryPair<TCategory>>,
	priorityMap?: Record<TCategory, number>
): HighlightPart<TCategory>[] {
	if (!content || isEmpty(highlights)) {
		return [{ text: content }];
	}

	const ranges = flatMap(highlights, (highlight) => {
		if (!highlight.text?.trim()) {
			return [];
		}

		return findTextRanges(highlight.text, content, highlight.category);
	});

	const mergedRanges = mergeRanges(ranges, priorityMap);

	return buildHighlightParts(content, mergedRanges);
}
