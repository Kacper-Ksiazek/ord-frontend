import type { TabsSupportedTailwindColor } from '$lib/components/navigation/tabs/tabs.types';
import { cn } from '$lib/utils/cn';
import type { WordType } from '$quicklyAddedWords/types';

const WORD_TYPE_BADGE_COLOR: Record<WordType, TabsSupportedTailwindColor> = {
	NOUN: 'blue',
	VERB: 'red',
	ADJECTIVE: 'green',
	ADVERB: 'orange',
	IDIOM: 'purple',
	PHRASE: 'yellow'
};

export function getWordTypeBadgeColor(type: WordType): TabsSupportedTailwindColor {
	return WORD_TYPE_BADGE_COLOR[type];
}

const WORD_TYPE_SWATCH_SURFACE: Record<WordType, string> = {
	NOUN: 'border-blue-200/70 bg-blue-50 dark:border-blue-800/50 dark:bg-blue-950/50',
	VERB: 'border-red-200/70 bg-danger/10',
	ADJECTIVE: 'border-emerald-200/70 bg-emerald-50 dark:border-emerald-800/50 dark:bg-emerald-950/50',
	ADVERB: 'border-orange-200/70 bg-orange-50 dark:border-orange-800/50 dark:bg-orange-950/50',
	IDIOM: 'border-violet-200/70 bg-violet-50 dark:border-violet-800/50 dark:bg-violet-950/50',
	PHRASE: 'border-line bg-highlight'
};

const WORD_TYPE_SWATCH_DOT: Record<WordType, string> = {
	NOUN: 'bg-blue-500',
	VERB: 'bg-red-500',
	ADJECTIVE: 'bg-emerald-500',
	ADVERB: 'bg-orange-500',
	IDIOM: 'bg-violet-500',
	PHRASE: 'bg-amber-500'
};

export function getWordTypeSwatchClasses(type: WordType): string {
	return cn(
		'inline-flex size-5 shrink-0 items-center justify-center rounded-sm border',
		WORD_TYPE_SWATCH_SURFACE[type]
	);
}

export function getWordTypeSwatchDotClasses(type: WordType): string {
	return cn('size-2 rounded-full', WORD_TYPE_SWATCH_DOT[type]);
}
