import type { components } from '@kacper-ksiazek/ord-api-types';
import type { LanguageName } from '../domain/word-type';

export type WordOverviewResponse = components['schemas']['WordOverviewResponse'];

export type GetWordOverviewParams = {
	language: LanguageName;
};
