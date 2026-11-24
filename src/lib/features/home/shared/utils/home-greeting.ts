export type HomeGreetingPeriod = 'morning' | 'afternoon' | 'evening';

/** Local clock: morning 05:00–11:59, afternoon 12:00–17:59, evening otherwise. */
export function homeGreetingPeriod(date: Date): HomeGreetingPeriod {
	const hour = date.getHours();

	if (hour >= 5 && hour < 12) {
		return 'morning';
	}

	if (hour >= 12 && hour < 18) {
		return 'afternoon';
	}

	return 'evening';
}

/** First word of the profile display name. The API stores one `name`, not a separate first name. */
export function firstNameFromDisplayName(name: string | null | undefined): string {
	const first = name?.trim().split(/\s+/)[0];

	return first ?? '';
}
