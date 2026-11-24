import type { components } from '@kacper-ksiazek/ord-api-types';
import type { LanguageName } from '$lib/types/core/domain/languages';

type Schemas = components['schemas'];

type FromSchema<K extends string, Fallback> = [K] extends [keyof Schemas]
	? Schemas[K & keyof Schemas]
	: Fallback;

/** Mirrors ExplainPhraseRequest until `@kacper-ksiazek/ord-api-types` publishes it. */
type ExplainPhraseRequestFallback = {
	phrase: string;
	language: LanguageName;
	context?: string | null;
	customInstruction?: string | null;
};

export type ExplainPhraseRequest = FromSchema<'ExplainPhraseRequest', ExplainPhraseRequestFallback>;

export const EXPLAIN_PHRASE_FOLLOW_UP_ACTIONS = [
	'SIMPLER',
	'MORE_EXAMPLES',
	'SIMILAR_EXPRESSIONS'
] as const;

type ExplainPhraseFollowUpActionFallback = (typeof EXPLAIN_PHRASE_FOLLOW_UP_ACTIONS)[number];

export type ExplainPhraseFollowUpAction = FromSchema<
	'ExplainPhraseFollowUpAction',
	ExplainPhraseFollowUpActionFallback
>;

/** Mirrors ExplainPhraseFollowUpRequest until `@kacper-ksiazek/ord-api-types` publishes it. */
type ExplainPhraseFollowUpRequestFallback = {
	phrase: string;
	language: LanguageName;
	previousExplanation: string;
	action: ExplainPhraseFollowUpAction;
	context?: string | null;
};

export type ExplainPhraseFollowUpRequest = FromSchema<
	'ExplainPhraseFollowUpRequest',
	ExplainPhraseFollowUpRequestFallback
>;

/** Mirrors ExplainPhraseAutocompleteRequest until `@kacper-ksiazek/ord-api-types` publishes it. */
type ExplainPhraseAutocompleteRequestFallback = {
	prefix: string;
	language: LanguageName;
};

export type ExplainPhraseAutocompleteRequest = FromSchema<
	'ExplainPhraseAutocompleteRequest',
	ExplainPhraseAutocompleteRequestFallback
>;

/** Mirrors ExplainPhraseAutocompleteResponse until `@kacper-ksiazek/ord-api-types` publishes it. */
type ExplainPhraseAutocompleteResponseFallback = {
	/** Text to append after the prefix as-is (may start with a space); empty when there is no suggestion. */
	completion: string;
};

export type ExplainPhraseAutocompleteResponse = FromSchema<
	'ExplainPhraseAutocompleteResponse',
	ExplainPhraseAutocompleteResponseFallback
>;
