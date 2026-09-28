import { splitPrefixedLines } from './parse-explainer-follow-up';

export interface ExplainerStreamView {
	explanation: string;
	examples: string[];
	examplePartial: string;
}

/** Splits a streamed explainer answer into the lead paragraph and `» ` example lines. */
export function splitExplainerStream(raw: string, finalize = false): ExplainerStreamView {
	const breakAt = raw.indexOf('\n\n');

	if (breakAt === -1) {
		return { explanation: raw, examples: [], examplePartial: '' };
	}

	const explanation = raw.slice(0, breakAt).trim();
	const { complete, partial } = splitPrefixedLines(raw.slice(breakAt + 2));
	const partialText = partial.trim();

	if (finalize && partialText.length > 0) {
		return {
			explanation,
			examples: [...complete, partialText],
			examplePartial: ''
		};
	}

	return { explanation, examples: complete, examplePartial: partialText };
}
