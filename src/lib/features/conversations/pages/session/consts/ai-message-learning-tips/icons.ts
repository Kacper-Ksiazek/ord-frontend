import { Book, BookOpen, ScrollText } from 'lucide-svelte';
import type { LearningTipCategory } from '$lib/types/conversation/domain/learning-tip-category';

export const AI_MESSAGE_LEARNING_TIP_ICONS_MAP: Record<LearningTipCategory, LucideIcon> = {
	GRAMMAR: BookOpen,
	VOCABULARY: Book,
	PHRASES: ScrollText
};
