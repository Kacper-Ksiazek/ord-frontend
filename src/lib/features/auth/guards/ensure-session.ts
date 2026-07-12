import { goto } from '$app/navigation';
import { getStorageItem, STORAGE_KEYS, setStorageItem } from '$lib/utils/local-storage';

let sessionInitialized = false;

export function ensureSessionOnNavigate() {
	if (sessionInitialized) {
		return;
	}

	sessionInitialized = true;

	setStorageItem(STORAGE_KEYS.SESSION_INITIALIZED, true);

	const storedUser = getStorageItem(STORAGE_KEYS.USER);

	if (!storedUser && !window.location.pathname.startsWith('/login')) {
		goto('/login');
	}
}
