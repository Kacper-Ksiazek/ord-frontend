import type {
	ConversationMessageMistakeSeverity,
	ConversationMessageSuggestionType
} from '$lib/types/conversation/domain/conversation-message-feedback';
import { Info, ThumbsDown, TriangleAlert, BookOpen, Layers } from 'lucide-svelte';

export const MISTAKE_SEVERITY_ICONS_MAP: Record<ConversationMessageMistakeSeverity, LucideIcon> = {
	MINOR: Info,
	MODERATE: ThumbsDown,
	CRITICAL: TriangleAlert
};

export const SUGGESTION_TYPE_ICONS_MAP: Record<ConversationMessageSuggestionType, LucideIcon> = {
	VOCABULARY: BookOpen,
	STRUCTURE: Layers
};
