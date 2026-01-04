import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';

interface HighlightRange {
	start: number;
	end: number;
	type: 'mistake' | 'strength' | 'suggestion';
	text: string;
}

export interface HighlightPart {
	text: string;
	highlight?: 'mistake' | 'strength' | 'suggestion';
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Finds all occurrences of a text in the message content (case-insensitive)
 */
function findTextRanges(text: string, content: string): HighlightRange[] {
	const ranges: HighlightRange[] = [];
	const escapedText = escapeRegex(text);
	const regex = new RegExp(escapedText, 'gi');
	let match;
	let lastIndex = 0;

	while ((match = regex.exec(content)) !== null) {
		// Prevent infinite loop if regex matches empty string
		if (match.index === lastIndex && match[0].length === 0) {
			regex.lastIndex++;
			continue;
		}
		lastIndex = regex.lastIndex;

		ranges.push({
			start: match.index,
			end: match.index + match[0].length,
			type: 'mistake', // Will be set by caller
			text: match[0] // Preserves original case from content
		});
	}

	return ranges;
}

/**
 * Merges overlapping ranges, prioritizing mistakes > suggestion > strength
 */
function mergeRanges(ranges: HighlightRange[]): HighlightRange[] {
	if (ranges.length === 0) return [];

	// Sort by start position, then by priority (mistake > suggestion > strength)
	const priority: Record<HighlightRange['type'], number> = {
		mistake: 0,
		suggestion: 1,
		strength: 2
	};

	ranges.sort((a, b) => {
		if (a.start !== b.start) return a.start - b.start;

		return priority[a.type] - priority[b.type];
	});

	const merged: HighlightRange[] = [];
	let current = ranges[0];

	for (let i = 1; i < ranges.length; i++) {
		const next = ranges[i];

		// If ranges overlap or are adjacent
		if (next.start <= current.end) {
			// Keep the one with higher priority (lower number)
			if (priority[next.type] < priority[current.type]) {
				current = next;
			} else {
				// Extend current range if next is completely within it
				if (next.end > current.end) {
					current = { ...current, end: next.end };
				}
			}
		} else {
			merged.push(current);
			current = next;
		}
	}

	merged.push(current);

	return merged;
}

/**
 * Highlights feedback-related text in message content and returns structured parts
 * This allows for full interactivity when rendered with Svelte components
 */
export function highlightFeedbackContent(
	content: string,
	feedback: ConversationUserMessageFeedbackDTO
): HighlightPart[] {
	if (!feedback || !content) return [{ text: content }];

	const ranges: HighlightRange[] = [];

	// Collect all ranges to highlight
	// Mistakes - red
	if (feedback.mistakes) {
		for (const mistake of feedback.mistakes) {
			if (mistake.phrase && mistake.phrase.trim()) {
				const mistakeRanges = findTextRanges(mistake.phrase, content);
				mistakeRanges.forEach((range) => {
					ranges.push({ ...range, type: 'mistake' });
				});
			}
		}
	}

	// Strengths - green
	if (feedback.strengths) {
		for (const strength of feedback.strengths) {
			if (strength.phrase && strength.phrase.trim()) {
				const strengthRanges = findTextRanges(strength.phrase, content);
				strengthRanges.forEach((range) => {
					ranges.push({ ...range, type: 'strength' });
				});
			}
		}
	}

	// Suggestions - blue
	if (feedback.suggestions) {
		for (const suggestion of feedback.suggestions) {
			if (suggestion.original && suggestion.original.trim()) {
				const suggestionRanges = findTextRanges(suggestion.original, content);
				suggestionRanges.forEach((range) => {
					ranges.push({ ...range, type: 'suggestion' });
				});
			}
		}
	}

	// Merge overlapping ranges
	const mergedRanges = mergeRanges(ranges);

	if (mergedRanges.length === 0) return [{ text: content }];

	// Build highlighted parts by processing ranges in order
	const parts: HighlightPart[] = [];
	let lastIndex = 0;

	for (const range of mergedRanges) {
		// Add text before this range
		if (range.start > lastIndex) {
			parts.push({ text: content.substring(lastIndex, range.start) });
		}

		// Add highlighted text
		parts.push({
			text: content.substring(range.start, range.end),
			highlight: range.type
		});

		lastIndex = range.end;
	}

	// Add remaining text
	if (lastIndex < content.length) {
		parts.push({ text: content.substring(lastIndex) });
	}

	return parts;
}
