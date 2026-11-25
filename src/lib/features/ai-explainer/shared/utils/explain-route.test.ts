import { describe, expect, it } from 'vitest';
import { explainRoute, parseExplainRouteId } from './explain-route';

const ID = '650e8400-e29b-41d4-a716-446655440000';

describe('parseExplainRouteId', () => {
	it('reads the id from an explanation route', () => {
		expect(parseExplainRouteId(`/explain/${ID}`)).toBe(ID);
		expect(parseExplainRouteId(`/explain/${ID}/`)).toBe(ID);
	});

	it('returns null for the composer, the history page and other paths', () => {
		expect(parseExplainRouteId('/explain')).toBeNull();
		expect(parseExplainRouteId('/explain/history')).toBeNull();
		expect(parseExplainRouteId(`/words/${ID}`)).toBeNull();
	});
});

describe('explainRoute', () => {
	it('builds the route of one explanation', () => {
		expect(explainRoute(ID)).toBe(`/explain/${ID}`);
	});
});
