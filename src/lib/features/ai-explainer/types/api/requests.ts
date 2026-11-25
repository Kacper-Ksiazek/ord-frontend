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

/** `explanationId` is client-generated; the API stores the finished explanation under it. */
type WithExplanationId = { explanationId?: string | null };

export type ExplainPhraseRequest = FromSchema<
	'ExplainPhraseRequest',
	ExplainPhraseRequestFallback
> &
	WithExplanationId;

export const EXPLAIN_PHRASE_FOLLOW_UP_ACTIONS = [
	'SIMPLER',
	'MORE_EXAMPLES',
	'SIMILAR_EXPRESSIONS',
	'COMMON_MISTAKES',
	'IN_MY_LANGUAGE',
	'USED_WITH'
] as const;

/** Defined locally until `@kacper-ksiazek/ord-api-types` publishes the three newest actions. */
export type ExplainPhraseFollowUpAction = (typeof EXPLAIN_PHRASE_FOLLOW_UP_ACTIONS)[number];

/** What the learner asked about; decides which refine actions fit. */
export type ExplainPhraseKind = 'WORD_OR_PHRASE' | 'GRAMMAR_OR_CONCEPT';

/** Mirrors ExplainPhraseFollowUpRequest until `@kacper-ksiazek/ord-api-types` publishes it. */
type ExplainPhraseFollowUpRequestFallback = {
	phrase: string;
	language: LanguageName;
	previousExplanation: string;
	action: ExplainPhraseFollowUpAction;
	context?: string | null;
};

export type ExplainPhraseFollowUpRequest = ExplainPhraseFollowUpRequestFallback & WithExplanationId;

export type ExplainPhraseEnhanceRequest = {
	prompt: string;
	language: LanguageName;
};

export type ExplainPhraseSuggestActionsRequest = {
	phrase: string;
	language: LanguageName;
	explanation: string;
	explanationId?: string | null;
};

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
