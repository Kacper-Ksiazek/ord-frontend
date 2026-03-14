import {
	ArrowRight,
	Book,
	BookOpen,
	ScrollText,
	CircleAlert,
	Lightbulb,
	ThumbsUp,
	CircleQuestionMark,
	Quote,
	Languages,
	Info,
	ThumbsDown,
	TriangleAlert,
	Layers
} from 'lucide-svelte';
import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';
import type { PhraseType } from '$lib/types/ongoing-conversation/api/responses';
import type {
	ConversationMessageMistakeSeverity,
	ConversationMessageSuggestionType
} from '$lib/types/conversation/domain/conversation-message-feedback';
import type { MessageFeedbackCriteria } from '$lib/types/conversation/domain/message-feedback-criteria';

export const AI_MESSAGE_LEARNING_TIP_ICONS_MAP: Record<LearningTipCategory, LucideIcon> = {
	GRAMMAR: BookOpen,
	VOCABULARY: Book,
	PHRASES: ScrollText
};

export const LEARNING_TIP_EXAMPLE_SENTENCE_ICON: LucideIcon = ArrowRight;

export const USER_MESSAGE_FEEDBACK_ICONS_MAP: Record<MessageFeedbackCriteria, LucideIcon> = {
	MISTAKES: CircleAlert,
	STRENGTHS: ThumbsUp,
	SUGGESTIONS: Lightbulb
};

export const EXPLANATION_ICON = CircleQuestionMark;

export const PHRASE_TYPE_ICONS_MAP: Record<PhraseType, LucideIcon> = {
	LITERAL: Quote,
	IDIOMATIC: Languages
};

export const MISTAKE_SEVERITY_ICONS_MAP: Record<ConversationMessageMistakeSeverity, LucideIcon> = {
	MINOR: Info,
	MODERATE: ThumbsDown,
	CRITICAL: TriangleAlert
};

export const SUGGESTION_TYPE_ICONS_MAP: Record<ConversationMessageSuggestionType, LucideIcon> = {
	VOCABULARY: BookOpen,
	STRUCTURE: Layers
};
