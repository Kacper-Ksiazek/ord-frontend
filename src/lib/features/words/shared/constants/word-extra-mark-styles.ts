import type { WordExtraMark } from '$words/types';
import {
	Ban,
	Briefcase,
	Coffee,
	Cpu,
	Feather,
	FlaskConical,
	MessageCircle,
	Scale,
	Stethoscope,
	Zap
} from 'lucide-svelte';

const WORD_EXTRA_MARK_ICON: Record<WordExtraMark, LucideIcon> = {
	OFFENSIVE: Ban,
	SLANG: Zap,
	FORMAL: Briefcase,
	INFORMAL: Coffee,
	SCIENTIFIC: FlaskConical,
	TECHNICAL: Cpu,
	LEGAL: Scale,
	MEDICAL: Stethoscope,
	COLLOQUIAL: MessageCircle,
	POETIC: Feather
};

export function getWordExtraMarkIcon(mark: WordExtraMark): LucideIcon {
	return WORD_EXTRA_MARK_ICON[mark];
}
