const EXAMPLE_PREFIX = '»';
const FIELD_SEPARATOR = ' | ';

export interface SimilarExpression {
	phrase: string;
	translation: string;
	description: string;
}

export interface AdditionalExamplesView {
	examples: string[];
	partial: string;
}

export interface SimilarExpressionsView {
	items: SimilarExpression[];
	partial: SimilarExpression | null;
}

interface PrefixedLines {
	complete: string[];
	partial: string;
}

/** Splits a `» ` stream into finished lines and the line still being typed. */
export function splitPrefixedLines(raw: string): PrefixedLines {
	const normalized = raw.replaceAll('\r\n', '\n');
	const endsWithNewline = normalized.endsWith('\n');
	const parts = normalized.split('\n');
	const partialSource = endsWithNewline ? '' : (parts.pop() ?? '');
	const complete = parts.map(stripPrefix).filter((line) => line.length > 0);

	return {
		complete,
		partial: stripPrefix(partialSource)
	};
}

export interface ParseAdditionalExamplesOptions {
	/** Treat the line still being typed as finished (e.g. stream ended without a trailing newline). */
	finalize?: boolean;
}

export function parseAdditionalExamples(
	raw: string,
	existing: string[],
	options: ParseAdditionalExamplesOptions = {}
): AdditionalExamplesView {
	const { complete, partial } = splitPrefixedLines(raw);
	const seen = new Set(existing.map((example) => example.trim()));
	const examples: string[] = [];

	for (const line of complete) {
		if (seen.has(line)) {
			continue;
		}

		seen.add(line);
		examples.push(line);
	}

	let partialText = partial.trim();

	if (partialText.length > 0 && !seen.has(partialText)) {
		if (options.finalize) {
			examples.push(partialText);
			partialText = '';
		}
	}

	return {
		examples,
		partial: partialText
	};
}

export function parseSimilarExpressions(
	raw: string,
	options: ParseAdditionalExamplesOptions = {}
): SimilarExpressionsView {
	const { complete, partial } = splitPrefixedLines(raw);
	const items = complete
		.map(parseSimilarExpression)
		.filter((item): item is SimilarExpression => item !== null);
	const partialItem = partial.trim().length > 0 ? parseSimilarExpression(partial, true) : null;

	if (options.finalize && partialItem && isCompleteSimilarExpression(partialItem)) {
		return { items: [...items, partialItem], partial: null };
	}

	return { items, partial: partialItem };
}

function isCompleteSimilarExpression(item: SimilarExpression): boolean {
	return item.phrase.length > 0 && item.translation.length > 0 && item.description.length > 0;
}

function stripPrefix(line: string): string {
	const trimmed = line.trim();

	if (!trimmed.startsWith(EXAMPLE_PREFIX)) {
		return '';
	}

	return trimmed.slice(EXAMPLE_PREFIX.length).trim();
}

function parseSimilarExpression(line: string, allowPartial = false): SimilarExpression | null {
	const [phrase = '', translation = '', ...descriptionParts] = line.split(FIELD_SEPARATOR);
	const description = descriptionParts.join(FIELD_SEPARATOR).trim();
	const parsed = {
		phrase: phrase.trim(),
		translation: translation.trim(),
		description
	};

	if (parsed.phrase.length === 0) {
		return null;
	}

	if (!allowPartial && (parsed.translation.length === 0 || parsed.description.length === 0)) {
		return null;
	}

	return parsed;
}
