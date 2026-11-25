import { parseEmphasisText } from '$lib/utils/text/parse-emphasis-text';

export interface CommonMistake {
	wrong: string;
	right: string;
	/** One short sentence on why it goes wrong; may still be streaming. */
	why: string;
}

export interface UsedWithItem {
	term: string;
	note: string;
}

const WRONG_MARK = '✗';
const RIGHT_MARK = '✓';

/**
 * Splits the "Common mistakes" follow-up into wrong / right / why triples. Each item is a block separated by
 * a blank line: a `✗ wrong` line, a `✓ right` line, then the explanation. Returns `null` for text that is not
 * in this format (entries saved before it existed), so the caller can fall back to plain text.
 */
export function parseCommonMistakes(raw: string): CommonMistake[] | null {
	const items: CommonMistake[] = [];

	for (const block of raw.split(/\n\s*\n/)) {
		let wrong = '';
		let right = '';
		const why: string[] = [];

		for (const line of block.split('\n').map((value) => value.trim())) {
			if (line.startsWith(WRONG_MARK)) {
				wrong = line.slice(WRONG_MARK.length).trim();
			} else if (line.startsWith(RIGHT_MARK)) {
				right = line.slice(RIGHT_MARK.length).trim();
			} else if (line.length > 0) {
				why.push(line);
			}
		}

		if (wrong || right) {
			items.push({ wrong, right, why: why.join(' ') });
		}
	}

	return items.length > 0 ? items : null;
}

/** Splits the "Used with" follow-up (`*combination* — note`, one per line) into term / note pairs. */
export function parseUsedWith(raw: string): UsedWithItem[] {
	return raw
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0)
		.map((line) => {
			const parts = parseEmphasisText(line);
			const emphasized = parts.find((part) => part.emphasized);

			if (emphasized) {
				const rest = parts
					.filter((part) => part !== emphasized)
					.map((part) => part.text)
					.join('');

				return { term: emphasized.text, note: stripSeparator(rest) };
			}

			const [term, ...note] = line.split(/\s[—–-]\s/);

			return { term: term.trim(), note: note.join(' — ').trim() };
		});
}

function stripSeparator(text: string): string {
	return text.replace(/^\s*[—–-]\s*/, '').trim();
}
