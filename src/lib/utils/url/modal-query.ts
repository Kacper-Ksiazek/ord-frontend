import { preserveQueryParam } from './preserve-query-param';

export const MODAL_QUERY_PARAM = 'modal';

/** Preserves whichever `modal` value is currently in the URL (any feature). */
export function preserveModalQueryParam(nextQuery: string, currentSearch: string): string {
	return preserveQueryParam(MODAL_QUERY_PARAM, nextQuery, currentSearch);
}
