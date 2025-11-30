import { getStorageItem, setStorageItem } from '$lib/utils/local-storage';
import type { RecentInterlocutorInfo } from '$lib/types/conversation/api/requests';

const MAX_RECENT_INTERLOCUTORS = 10;
const RECENT_INTERLOCUTORS_KEY = 'recent_interlocutors';

export function saveNewInterlocutorToLocalStorage(interlocutor: RecentInterlocutorInfo) {
	const recentInterlocutors: RecentInterlocutorInfo[] =
		getStorageItem(RECENT_INTERLOCUTORS_KEY) ?? [];

	recentInterlocutors.unshift(interlocutor);

	setStorageItem(RECENT_INTERLOCUTORS_KEY, recentInterlocutors.slice(0, MAX_RECENT_INTERLOCUTORS));
}

export function getRecentInterlocutorsFromLocalStorage(): RecentInterlocutorInfo[] {
	return getStorageItem(RECENT_INTERLOCUTORS_KEY) ?? [];
}
