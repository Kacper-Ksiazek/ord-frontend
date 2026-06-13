import type { paths } from '@kacper-ksiazek/ord-api-types';

export type GetConversationsFilters = NonNullable<
	paths['/api/v1/conversations/']['get']['parameters']['query']
>;
