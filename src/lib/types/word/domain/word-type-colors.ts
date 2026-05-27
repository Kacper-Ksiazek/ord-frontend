import { cn } from 'flowbite-svelte';
import {
	getTailwindColorTheme,
	type TailwindColorTheme
} from '$lib/utils/theme/get-tailwind-colors';
import type { WordType } from './enums';

const WORD_TYPE_COLOR_MAP: Record<WordType, TailwindColor> = {
	NOUN: 'blue',
	VERB: 'red',
	ADJECTIVE: 'green',
	ADVERB: 'orange',
	IDIOM: 'purple',
	PHRASE: 'yellow'
} as const;

const WORD_TYPE_THEME_MAP: Record<WordType, TailwindColorTheme> = {
	NOUN: getTailwindColorTheme('blue'),
	VERB: getTailwindColorTheme('red'),
	ADJECTIVE: getTailwindColorTheme('green'),
	ADVERB: getTailwindColorTheme('orange'),
	IDIOM: getTailwindColorTheme('purple'),
	PHRASE: getTailwindColorTheme('yellow')
} as const;

export function getWordTypeColors(type: WordType): TailwindColorTheme {
	return WORD_TYPE_THEME_MAP[type];
}

export function getWordTypeColorName(type: WordType): TailwindColor {
	return WORD_TYPE_COLOR_MAP[type];
}

export function getWordTypeChipClasses(type: WordType): string {
	const theme = getWordTypeColors(type);

	return cn(
		'rounded border px-1.5 py-0.5 text-[11px] font-medium leading-none',
		theme.chipBorder,
		theme.highlightedText
	);
}

export function getWordTypeSwatchClasses(type: WordType): string {
	const theme = getWordTypeColors(type);

	return cn('size-5 shrink-0 rounded-sm border', theme.chipBorder, theme.highlightedText);
}
