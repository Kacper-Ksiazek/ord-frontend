export interface EmphasisTextPart {
	text: string;
	emphasized: boolean;
}

const EMPHASIS_TEXT_REGEX = /(\*([^*]+?)\*|'([^']+?)')/g;

export function parseEmphasisText(text: string): EmphasisTextPart[] {
	const parts: EmphasisTextPart[] = [];
	let lastIndex = 0;
	let match: RegExpExecArray | null;

	while ((match = EMPHASIS_TEXT_REGEX.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push({ text: text.slice(lastIndex, match.index), emphasized: false });
		}

		parts.push({ text: match[2] ?? match[3], emphasized: true });
		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < text.length) {
		parts.push({ text: text.slice(lastIndex), emphasized: false });
	}

	return parts.length > 0 ? parts : [{ text, emphasized: false }];
}
