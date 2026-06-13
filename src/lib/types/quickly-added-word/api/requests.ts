import type { components, paths } from '@ord-api/ord-api-types';

export type ApproveManyQAWRequest = components['schemas']['ApproveManyQAWRequest'];
export type CreateQAWRequest = components['schemas']['CreateQAWRequest'];
export type UpdateQAWRequest = components['schemas']['UpdateQAWRequest'];

export type BulkCreateQAWRequest = NonNullable<
	paths['/api/v1/quickly-added-words/bulk-create']['post']['requestBody']
>['content']['application/json'];

export type BulkDeleteQAWRequest = NonNullable<
	paths['/api/v1/quickly-added-words/bulk-delete']['post']['requestBody']
>['content']['application/json'];
