import * as m from '$lib/paraglide/messages.js';
import { firstNameFromDisplayName, homeGreetingPeriod } from './home-greeting';

/** Localised "Good morning/afternoon/evening, {name}" for the given local time. */
export function homeGreetingMessage(date: Date, displayName: string | null | undefined): string {
	const name = firstNameFromDisplayName(displayName);
	const period = homeGreetingPeriod(date);

	if (period === 'morning') {
		return m['features.home.home.greeting_morning']({ name });
	}

	if (period === 'afternoon') {
		return m['features.home.home.greeting_afternoon']({ name });
	}

	return m['features.home.home.greeting_evening']({ name });
}
