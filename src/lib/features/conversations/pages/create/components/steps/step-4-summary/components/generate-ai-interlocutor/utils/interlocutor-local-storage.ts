import { getStorageItem, LOCAL_STORAGE_KEYS, setStorageItem } from '$lib/utils/local-storage';
import type { RecentInterlocutorInfo } from '$lib/types/conversation/api/requests';

const MAX_RECENT_INTERLOCUTORS = 10;

export function saveNewInterlocutorToLocalStorage(interlocutor: RecentInterlocutorInfo) {
	const recentInterlocutors: RecentInterlocutorInfo[] =
		getStorageItem(LOCAL_STORAGE_KEYS.RECENT_INTERLOCUTORS) ?? [];

	recentInterlocutors.unshift(interlocutor);

	setStorageItem(
		LOCAL_STORAGE_KEYS.RECENT_INTERLOCUTORS,
		recentInterlocutors.slice(0, MAX_RECENT_INTERLOCUTORS)
	);
}

export function getRecentInterlocutorsFromLocalStorage(): RecentInterlocutorInfo[] {
	return getStorageItem(LOCAL_STORAGE_KEYS.RECENT_INTERLOCUTORS) ?? [];
}
