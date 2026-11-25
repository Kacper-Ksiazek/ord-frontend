const EXPLAIN_ROUTE_ID =
	/^\/explain\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\/?$/i;

/** The explanation id in `/explain/<id>`; `null` for `/explain` and every other path. */
export function parseExplainRouteId(pathname: string): string | null {
	return EXPLAIN_ROUTE_ID.exec(pathname)?.[1] ?? null;
}

export function explainRoute(explanationId: string): string {
	return `/explain/${explanationId}`;
}
