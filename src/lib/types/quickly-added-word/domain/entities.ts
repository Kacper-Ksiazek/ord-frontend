import type { components } from '@ord-api/ord-api-types';

export type QuicklyAddedWordDTO = components['schemas']['QuicklyAddedWordDTO'];

export type CompactQAW = Pick<
	QuicklyAddedWordDTO,
	'word' | 'definition' | 'extraMark' | 'translation' | 'type'
>;
