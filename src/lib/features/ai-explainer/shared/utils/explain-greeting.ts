import * as m from '$lib/paraglide/messages.js';

/** Composer greeting, personalised with the user's first name when it is known. */
export function explainGreeting(displayName: string | null | undefined): string {
	const firstName = displayName?.trim().split(/\s+/)[0] ?? '';

	return firstName.length > 0
		? m['features.ai-explainer.explain-popover.compact_greeting_named']({ name: firstName })
		: m['features.ai-explainer.explain-popover.compact_greeting']();
}
