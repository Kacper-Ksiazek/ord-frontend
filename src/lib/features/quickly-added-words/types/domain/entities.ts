import type { components } from '@kacper-ksiazek/ord-api-types';

export type QuicklyAddedWordDTO = components['schemas']['QuicklyAddedWordDTO'];

export type CompactQAW = Pick<
	QuicklyAddedWordDTO,
	'word' | 'definition' | 'extraMark' | 'translation' | 'type'
>;
