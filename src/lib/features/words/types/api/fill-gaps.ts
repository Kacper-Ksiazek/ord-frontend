import type { components } from '@kacper-ksiazek/ord-api-types';

export type WordFillGapsItem = components['schemas']['WordFillGapsItem'];
export type WordFillGapsRequest = components['schemas']['WordFillGapsRequest'];
export type WordFillGapsResultItem = components['schemas']['WordFillGapsResultItem'];
export type WordFillGapsResponse = components['schemas']['WordFillGapsResponse'];

export type WordFillGapsRowErrorCode = 'NON_EXISTENT_WORD' | 'AMBIGUOUS_WORD' | (string & {});
