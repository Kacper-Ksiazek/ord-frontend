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

const WORD_TYPE_SWATCH: Record<WordType, string> = {
	NOUN:
		'border-blue-200/70 bg-blue-50 text-blue-800 dark:border-blue-800/50 dark:bg-blue-950/50 dark:text-blue-200',
	VERB: 'border-red-200/70 bg-danger/10 text-danger',
	ADJECTIVE:
		'border-emerald-200/70 bg-emerald-50 text-emerald-800 dark:border-emerald-800/50 dark:bg-emerald-950/50 dark:text-emerald-200',
	ADVERB:
		'border-orange-200/70 bg-orange-50 text-orange-800 dark:border-orange-800/50 dark:bg-orange-950/50 dark:text-orange-200',
	IDIOM:
		'border-violet-200/70 bg-violet-50 text-violet-800 dark:border-violet-800/50 dark:bg-violet-950/50 dark:text-violet-200',
	PHRASE: 'border-line bg-highlight text-ink'
};

export function getWordTypeSwatchClasses(type: WordType): string {
	return cn('size-5 shrink-0 rounded-sm border', WORD_TYPE_SWATCH[type]);
}
