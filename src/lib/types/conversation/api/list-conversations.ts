import type { paths } from '@ord-api/ord-api-types';

export type GetConversationsFilters = NonNullable<
	paths['/api/v1/conversations/']['get']['parameters']['query']
>;
