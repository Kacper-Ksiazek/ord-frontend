import type { ExplainPhraseFollowUpAction, ExplainPhraseKind } from './requests';
import type { LanguageName } from '$lib/types/core/domain/languages';

/** Mirrors AIExplanationDTO until `@kacper-ksiazek/ord-api-types` publishes it. */
export type SavedExplanation = {
	id: string;
	phrase: string;
	language: LanguageName;
	explanation: string;
	/** Text of each follow-up already applied, keyed by action. */
	followUps: Partial<Record<ExplainPhraseFollowUpAction, string>>;
	kind?: ExplainPhraseKind | null;
	/** One emoji representing the topic; null for entries saved before it was recorded. */
	emoji?: string | null;
	/** Refine actions that fit `kind`; empty for entries saved before the kind was recorded. */
	suggestedActions: ExplainPhraseFollowUpAction[];
	createdAt: string;
};

/** Mirrors ExplainPhraseSuggestActionsResponse until `@kacper-ksiazek/ord-api-types` publishes it. */
export type ExplainPhraseSuggestActionsResponse = {
	kind: ExplainPhraseKind;
	/** Every action that fits the kind, most useful first. */
	actions: ExplainPhraseFollowUpAction[];
	emoji?: string | null;
};

/** Mirrors ExplainPhraseEnhanceResponse until `@kacper-ksiazek/ord-api-types` publishes it. */
export type ExplainPhraseEnhanceResponse = {
	/** The learner's request rewritten to be clearer, at most 255 characters. */
	prompt: string;
};
