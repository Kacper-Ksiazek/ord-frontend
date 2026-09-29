/** Keeps a single query param when another screen rebuilds the rest of the query. */
export function preserveQueryParam(
	paramName: string,
	nextQuery: string,
	currentSearch: string
): string {
	const value = new URLSearchParams(currentSearch).get(paramName);

	if (value === null) {
		return nextQuery;
	}

	const part = `${paramName}=${encodeURIComponent(value)}`;
	const parts = nextQuery
		.split('&')
		.filter((segment) => segment.length > 0 && !segment.startsWith(`${paramName}=`));

	parts.push(part);

	return parts.join('&');
}
