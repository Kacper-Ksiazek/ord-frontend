import { getStorageItem, setStorageItem } from '$lib/utils/local-storage';
import type { RecentInterlocutorInfo } from '$conversations/types/api/requests';

const MAX_RECENT_INTERLOCUTORS = 10;
const LS_KEY = 'recent_interlocutors';

export function saveNewInterlocutorToLocalStorage(interlocutor: RecentInterlocutorInfo) {
	const recentInterlocutors: RecentInterlocutorInfo[] = getStorageItem(LS_KEY) ?? [];

	recentInterlocutors.unshift(interlocutor);

	setStorageItem(LS_KEY, recentInterlocutors.slice(0, MAX_RECENT_INTERLOCUTORS));
}

export function getRecentInterlocutorsFromLocalStorage(): RecentInterlocutorInfo[] {
	return getStorageItem(LS_KEY) ?? [];
}
