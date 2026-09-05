import type { paths } from '@kacper-ksiazek/ord-api-types';

export type GetWordsParams = paths['/api/v1/words']['get']['parameters']['query'];

/** Main words page view — learning register vs pending capture queue. */
export type WordsViewMode = 'learning' | 'pending';
