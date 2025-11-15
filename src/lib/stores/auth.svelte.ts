import { browser } from '$app/environment';
import type { UserDTO } from '$lib/features/auth/types';
import {
	getStorageItem,
	removeStorageItem,
	STORAGE_KEYS,
	setStorageItem
} from '$lib/utils/local-storage';

class AuthStore {
	user = $state<UserDTO | null>(null);

	constructor() {
		// Initialize from localStorage on client side
		if (browser) {
			this.loadUserFromStorage();
		}
	}

	get isAuthenticated(): boolean {
		return this.user !== null;
	}

	setUser(user: UserDTO | null) {
		this.user = user;

		if (browser) {
			if (user) {
				setStorageItem(STORAGE_KEYS.USER, user);
			} else {
				removeStorageItem(STORAGE_KEYS.USER);
			}
		}
	}

	loadUserFromStorage() {
		if (!browser) return;

		const storedUser = getStorageItem<UserDTO>(STORAGE_KEYS.USER);
		if (storedUser) {
			this.user = storedUser;
		}
	}

	clearUser() {
		this.user = null;
		if (browser) {
			removeStorageItem(STORAGE_KEYS.USER);
		}
	}
}

export const authStore = new AuthStore();
