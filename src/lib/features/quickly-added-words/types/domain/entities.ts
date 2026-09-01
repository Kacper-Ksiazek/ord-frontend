import type { components } from '@kacper-ksiazek/ord-api-types';

export type CapturedWordListItem = components['schemas']['WordListItem'];

export type CompactCapturedWord = Pick<
	CapturedWordListItem,
	'sourceWord' | 'translation' | 'extraMark' | 'type'
>;
