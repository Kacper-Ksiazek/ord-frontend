import type {
	AIMessageGrammarTip,
	AIMessageVocabularyTip,
	AIMessagePhraseTip,
	TipRegister
} from '$lib/types/ongoing-conversation/api/responses';

interface AggregatedLearningTipBase {
	phrase: string;
	register: TipRegister;
	createdAt: Date;
}

export interface AggregatedGrammarTip extends AggregatedLearningTipBase {
	type: 'GRAMMAR';
	data: AIMessageGrammarTip;
}

export interface AggregatedVocabularyTip extends AggregatedLearningTipBase {
	type: 'VOCABULARY';
	data: AIMessageVocabularyTip;
}

export interface AggregatedPhraseTip extends AggregatedLearningTipBase {
	type: 'PHRASES';
	data: AIMessagePhraseTip;
}

export type AggregatedLearningTip =
	| AggregatedGrammarTip
	| AggregatedVocabularyTip
	| AggregatedPhraseTip;
