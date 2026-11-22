const EXAMPLE_PREFIX = '» ';

/**
 * Builds the `previousExplanation` payload for a `MORE_EXAMPLES` follow-up: the definition as the
 * lead paragraph, then already shown examples as `» ` lines so the model does not repeat them.
 */
export function buildExamplesPreviousExplanation(
	definition: string,
	shownExamples: string[]
): string {
	const lead = definition.trim();
	const lines = shownExamples
		.map((example) => example.trim())
		.filter((example) => example.length > 0)
		.map((example) => `${EXAMPLE_PREFIX}${example}`);

	if (lines.length === 0) {
		return lead;
	}

	return `${lead}\n\n${lines.join('\n')}`;
}
