/**
 * When the user keeps typing the characters of a visible suggestion, returns what is still left
 * of it, so the suggestion stays without a new request. Returns `null` when the new value no
 * longer follows the suggestion (the caller should drop it and ask again).
 */
export function remainingCompletion(
	suggestedFor: string,
	completion: string,
	value: string
): string | null {
	const full = suggestedFor + completion;

	if (!value.startsWith(suggestedFor) || !full.startsWith(value) || value.length >= full.length) {
		return null;
	}

	return full.slice(value.length);
}
