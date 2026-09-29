import { MODAL_QUERY_PARAM } from '$lib/utils/url/modal-query';

export const EXPLAIN_MODAL_QUERY_VALUE = 'explain';

export function isExplainModalQuery(searchParams: URLSearchParams): boolean {
	return searchParams.get(MODAL_QUERY_PARAM) === EXPLAIN_MODAL_QUERY_VALUE;
}

export function isExplainModalOpenFromLocationSearch(search: string): boolean {
	return isExplainModalQuery(new URLSearchParams(search));
}

/** Search string with a leading `?`, or `''` when no params remain. */
export function searchWithExplainModal(currentSearch: string, open: boolean): string {
	const params = new URLSearchParams(currentSearch);

	if (open) {
		params.set(MODAL_QUERY_PARAM, EXPLAIN_MODAL_QUERY_VALUE);
	} else if (params.get(MODAL_QUERY_PARAM) === EXPLAIN_MODAL_QUERY_VALUE) {
		params.delete(MODAL_QUERY_PARAM);
	}

	const query = params.toString();

	return query ? `?${query}` : '';
}
