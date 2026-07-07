import type { components } from '@kacper-ksiazek/ord-api-types';

export type ReviewedUserConversationMessage =
	components['schemas']['ConversationUserMessageAnalysisPayload'];

export type {
	AIMessageLearningTips,
	AIMessageVocabularyTip,
	AIMessageGrammarTip,
	AIMessagePhraseTip,
	TipRegister,
	PhraseType
} from '../../domain/ai-message-learning-tips';
