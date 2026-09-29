export interface EmphasisTextPart {
	text: string;
	emphasized: boolean;
}

const EMPHASIS_TEXT_REGEX = /(\*([^*]+?)\*|'([^']+?)'|"([^"]+?)"|\u201C([^\u201D]+?)\u201D)/g;

export function parseEmphasisText(text: string): EmphasisTextPart[] {
	const parts: EmphasisTextPart[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = EMPHASIS_TEXT_REGEX.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push({ text: text.slice(lastIndex, match.index), emphasized: false });
		}

		parts.push({
			text: match[2] ?? match[3] ?? match[4] ?? match[5],
			emphasized: true
		});
		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < text.length) {
		parts.push({ text: text.slice(lastIndex), emphasized: false });
	}

	return parts.length > 0 ? parts : [{ text, emphasized: false }];
}

export function stripEmphasisMarkers(text: string): string {
	return parseEmphasisText(text)
		.map((part) => part.text)
		.join('');
}

/** Headword must not be emphasized in UI when it already appears as the row title. */
export function parseEmphasisTextForHeadword(text: string, headword: string): EmphasisTextPart[] {
	const trimmedHeadword = headword.trim();

	if (!trimmedHeadword) {
		return parseEmphasisText(text);
	}

	return parseEmphasisText(text).map((part) =>
		part.emphasized && part.text.trim() === trimmedHeadword
			? { text: part.text, emphasized: false }
			: part
	);
}

export function plainTextFromEmphasisParts(parts: EmphasisTextPart[]): string {
	return parts.map((part) => part.text).join('');
}
