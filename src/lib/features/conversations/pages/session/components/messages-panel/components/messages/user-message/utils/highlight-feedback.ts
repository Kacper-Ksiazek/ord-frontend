import type { ConversationUserMessageFeedbackDTO } from '$lib/types/conversation/domain/conversation-message-feedback';

interface HighlightRange {
	start: number;
	end: number;
	type: 'mistake' | 'vocab' | 'alternative' | 'strength';
	text: string;
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
 * Merges overlapping ranges, prioritizing mistakes > vocab > alternative > strength
 */
function mergeRanges(ranges: HighlightRange[]): HighlightRange[] {
	if (ranges.length === 0) return [];

	// Sort by start position, then by priority (mistake > vocab > alternative > strength)
	const priority: Record<HighlightRange['type'], number> = {
		mistake: 0,
		vocab: 1,
		alternative: 2,
		strength: 3
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
 * Highlights feedback-related text in message content using HTML spans
 */
export function highlightFeedbackContent(
	content: string,
	feedback: ConversationUserMessageFeedbackDTO
): string {
	if (!feedback || !content) return content;

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

	// Vocabulary enrichment - blue
	if (feedback.vocabularyEnrichment) {
		for (const enrichment of feedback.vocabularyEnrichment) {
			if (enrichment.original && enrichment.original.trim()) {
				const vocabRanges = findTextRanges(enrichment.original, content);
				vocabRanges.forEach((range) => {
					ranges.push({ ...range, type: 'vocab' });
				});
			}
		}
	}

	// Alternative expressions - purple
	if (feedback.alternativeExpressions) {
		for (const alt of feedback.alternativeExpressions) {
			if (alt.context && alt.context.trim()) {
				const altRanges = findTextRanges(alt.context, content);
				altRanges.forEach((range) => {
					ranges.push({ ...range, type: 'alternative' });
				});
			}
		}
	}

	// Strengths - green
	if (feedback.strengthsIdentified) {
		for (const strength of feedback.strengthsIdentified) {
			if (strength && strength.trim()) {
				const strengthRanges = findTextRanges(strength, content);
				strengthRanges.forEach((range) => {
					ranges.push({ ...range, type: 'strength' });
				});
			}
		}
	}

	// Merge overlapping ranges
	const mergedRanges = mergeRanges(ranges);

	if (mergedRanges.length === 0) return content;

	// Build highlighted HTML string by processing ranges in order
	const parts: Array<{ text: string; highlight?: HighlightRange['type'] }> = [];
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

	// Convert to HTML with appropriate highlight classes
	return parts
		.map((part) => {
			if (part.highlight) {
				const classes = {
					mistake: 'bg-red-200 dark:bg-red-900/50 text-red-900 dark:text-red-100',
					vocab: 'bg-blue-200 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100',
					alternative: 'bg-purple-200 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100',
					strength: 'bg-green-200 dark:bg-green-900/50 text-green-900 dark:text-green-100'
				};

				return `<span class="${classes[part.highlight]} px-1 rounded">${escapeHtml(part.text)}</span>`;
			}

			return escapeHtml(part.text);
		})
		.join('');
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}
