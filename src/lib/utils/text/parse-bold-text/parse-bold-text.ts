export interface BoldTextPart {
	text: string;
	bold: boolean;
}

const BOLD_TEXT_REGEX = /\*\*(.*?)\*\*/g;

export function parseBoldText(text: string): BoldTextPart[] {
	const parts: BoldTextPart[] = [];
	let lastIndex = 0;
	let match;

	while ((match = BOLD_TEXT_REGEX.exec(text)) !== null) {
		if (match.index > lastIndex) {
			parts.push({ text: text.slice(lastIndex, match.index), bold: false });
		}
		parts.push({ text: match[1], bold: true });
		lastIndex = match.index + match[0].length;
	}

	if (lastIndex < text.length) {
		parts.push({ text: text.slice(lastIndex), bold: false });
	}

	return parts.length > 0 ? parts : [{ text, bold: false }];
}
