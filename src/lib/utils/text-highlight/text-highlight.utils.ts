import isEmpty from 'lodash/isEmpty';
import uniq from 'lodash/uniq';
import type { HighlightRange, HighlightPart } from './text-highlight.types';

function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function findTextRanges<TCategory extends string | number | symbol>(
	text: string,
	content: string,
	category: TCategory
): HighlightRange<TCategory>[] {
	const ranges: HighlightRange<TCategory>[] = [];
	const escapedText = escapeRegex(text);
	const regex = new RegExp(escapedText, 'gi');

	let match;
	let lastIndex = 0;

	while ((match = regex.exec(content)) !== null) {
		if (match.index === lastIndex && isEmpty(match[0])) {
			regex.lastIndex++;
			continue;
		}
		lastIndex = regex.lastIndex;

		ranges.push({
			start: match.index,
			end: match.index + match[0].length,
			category,
			text: match[0]
		});
	}

	return ranges;
}

export function mergeRanges<TCategory extends string | number | symbol>(
	ranges: HighlightRange<TCategory>[],
	priorityMap?: Record<TCategory, number>
): HighlightRange<TCategory>[] {
	if (isEmpty(ranges)) {
		return [];
	}

	const getPriority = (category: TCategory): number => {
		if (priorityMap) {
			return priorityMap[category] ?? 0;
		}
		const uniqueCategories = uniq(ranges.map((r) => r.category));

		return uniqueCategories.indexOf(category);
	};

	ranges.sort((a, b) => {
		if (a.start !== b.start) {
			return a.start - b.start;
		}

		return getPriority(b.category) - getPriority(a.category);
	});

	const merged: HighlightRange<TCategory>[] = [];
	let current = ranges[0];

	for (let i = 1; i < ranges.length; i++) {
		const next = ranges[i];

		if (next.start <= current.end) {
			const nextPriority = getPriority(next.category);
			const currentPriority = getPriority(current.category);

			if (nextPriority > currentPriority) {
				current = next;
			} else if (next.end > current.end) {
				current = { ...current, end: next.end };
			}
		} else {
			merged.push(current);
			current = next;
		}
	}

	merged.push(current);

	return merged;
}

export function buildHighlightParts<TCategory extends string | number | symbol>(
	content: string,
	mergedRanges: HighlightRange<TCategory>[]
): HighlightPart<TCategory>[] {
	if (isEmpty(mergedRanges)) {
		return [{ text: content }];
	}

	const parts: HighlightPart<TCategory>[] = [];
	let lastIndex = 0;

	for (const range of mergedRanges) {
		if (range.start > lastIndex) {
			parts.push({ text: content.substring(lastIndex, range.start) });
		}

		parts.push({
			text: content.substring(range.start, range.end),
			highlight: range.category
		});

		lastIndex = range.end;
	}

	if (lastIndex < content.length) {
		parts.push({ text: content.substring(lastIndex) });
	}

	return parts;
}
