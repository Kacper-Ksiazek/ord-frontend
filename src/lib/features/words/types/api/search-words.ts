import type { components } from '@kacper-ksiazek/ord-api-types';
import type { WordsViewMode } from './list-words';

export type SearchWordsRequest = components['schemas']['GetManyWordsRequest'] & {
	wordTypes?: components['schemas']['GetManyWordsRequest']['wordType'][] | null;
	wordExtraMarks?: components['schemas']['GetManyWordsRequest']['wordExtraMark'][] | null;
};

export type SearchWordsParams = SearchWordsRequest;

export interface BuildSearchWordsParamsInput {
	language: SearchWordsRequest['language'];
	viewMode: WordsViewMode;
	page: number;
	learningPerPage: number;
	pendingPerPage: number;
}
