export const MODAL_QUERY_PARAM = 'modal';
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

/** Keeps `modal` when another screen rebuilds the rest of the query. */
export function preserveModalQueryParam(nextQuery: string, currentSearch: string): string {
	const modal = new URLSearchParams(currentSearch).get(MODAL_QUERY_PARAM);

	if (!modal) {
		return nextQuery;
	}

	const modalPart = `${MODAL_QUERY_PARAM}=${encodeURIComponent(modal)}`;
	const parts = nextQuery
		.split('&')
		.filter((part) => part.length > 0 && !part.startsWith(`${MODAL_QUERY_PARAM}=`));

	parts.push(modalPart);

	return parts.join('&');
}
