import type {
	ConversationAITone,
	ConversationType
} from '$conversations/types/domain/conversation';

export const CONVERSATION_TYPES: ConversationType[] = [
	'SMALL_TALK',
	'SCENARIO_ROLEPLAY',
	'EXAM_PRACTICE',
	'TOPIC_EXPLORATION',
	'OXFORD_DEBATE'
] as const;

/** Conversation types that cannot be chosen in the create flow (UI-only). */
export const DISABLED_CONVERSATION_TYPES = new Set<ConversationType>([
	'SCENARIO_ROLEPLAY',
	'EXAM_PRACTICE',
	'OXFORD_DEBATE'
]);

export const CONVERSATION_TONES: ConversationAITone[] = [
	'FRIENDLY',
	'FORMAL',
	'HUMOROUS',
	'NEUTRAL',
	'ENCOURAGING',
	'CHALLENGING'
] as const;
