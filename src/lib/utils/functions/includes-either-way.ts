/**
 * Checks if a text includes another text, regardless of the order of the text and the search.
 */
export function includesEitherWay(a: string, b: string): boolean {
	return a.includes(b) || b.includes(a);
}
