import type {
	ConversationAITone,
	ConversationType
} from '$lib/types/conversation/domain/conversation';

export const CONVERSATION_TYPES: ConversationType[] = [
	'SMALL_TALK',
	'SCENARIO_ROLEPLAY',
	'EXAM_PRACTICE',
	'TOPIC_EXPLORATION',
	'OXFORD_DEBATE'
] as const;

export const CONVERSATION_TONES: ConversationAITone[] = [
	'FRIENDLY',
	'FORMAL',
	'HUMOROUS',
	'NEUTRAL',
	'ENCOURAGING',
	'CHALLENGING'
] as const;
