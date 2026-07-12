import type { PhraseType } from '$conversations/types';
import { Quote, Languages } from 'lucide-svelte';

export const PHRASE_TYPE_ICONS_MAP: Record<PhraseType, LucideIcon> = {
	LITERAL: Quote,
	IDIOMATIC: Languages
};
