import { ArrowRight, Book, BookOpen, ScrollText } from 'lucide-svelte';
import type { LearningTipCategory } from '$conversations/types';

export const AI_MESSAGE_LEARNING_TIP_ICONS_MAP: Record<LearningTipCategory, LucideIcon> = {
	GRAMMAR: BookOpen,
	VOCABULARY: Book,
	PHRASES: ScrollText
};

export const LEARNING_TIP_EXAMPLE_SENTENCE_ICON: LucideIcon = ArrowRight;
