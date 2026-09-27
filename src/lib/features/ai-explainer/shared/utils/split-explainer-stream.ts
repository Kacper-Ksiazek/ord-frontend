const EXAMPLE_PREFIX = '»';

export interface ExplainerStreamView {
	explanation: string;
	examples: string[];
}

/** Splits a streamed explainer answer into the lead paragraph and `» ` example lines. */
export function splitExplainerStream(raw: string): ExplainerStreamView {
	const breakAt = raw.indexOf('\n\n');

	if (breakAt === -1) {
		return { explanation: raw, examples: [] };
	}

	const explanation = raw.slice(0, breakAt).trim();
	const examples = raw
		.slice(breakAt + 2)
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.startsWith(EXAMPLE_PREFIX))
		.map((line) => line.slice(EXAMPLE_PREFIX.length).trim())
		.filter((line) => line.length > 0);

	return { explanation, examples };
}
