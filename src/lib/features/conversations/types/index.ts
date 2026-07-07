// Conversations feature types

export * from './api/errors';
export * from './api/requests';
export type { GeneratedAIInterlocutorData, SuggestedConversationTopic } from './api/responses';
export * from './api/list-conversations';
export * from './api/conversation-list-activity';
export * from './api';
export * from './domain/conversation';
export type {
	ConversationMessageDTO,
	NormalizedConversationMessage,
	CompactConversationAiMessage,
	CompactConversationUserMessage,
	CompactConversationMessage
} from './domain/conversation-message';
export * from './domain/conversation-message-analysis';
export * from './domain/learning-tip-category';
export * from './domain/message-analysis-criteria';
export * from './ongoing-conversation/api/requests';
export type {
	AIMessageLearningTips,
	AIMessageVocabularyTip,
	AIMessageGrammarTip,
	AIMessagePhraseTip,
	TipRegister,
	PhraseType
} from './ongoing-conversation/api/responses';
