import type { components } from '@ord-api/ord-api-types';

export type ReviewedUserConversationMessage =
	components['schemas']['ConversationUserMessageAnalysisPayload'];

export type ConversationMessageDTO = components['schemas']['ConversationMessageDTO'];

export type AIMessageLearningTips = components['schemas']['AIMessageLearningTips'];

export type AIMessageVocabularyTip = components['schemas']['AnnotatedVocabularyTip'];
export type AIMessageGrammarTip = components['schemas']['AnnotatedGrammarTip'];
export type AIMessagePhraseTip = components['schemas']['AnnotatedPhraseTip'];

export type TipRegister = components['schemas']['TipRegister'];
export type PhraseType = components['schemas']['PhraseType'];
