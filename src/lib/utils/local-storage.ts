/**
 * Local storage utilities with app-specific prefix
 * All keys are automatically prefixed with 'ord_app_'
 */

const APP_PREFIX = 'ord_app_';

/**
 * Internal helper to ensure a key has the app prefix
 */
function getKeyWithPrefix(key: string): string {
	return key.startsWith(APP_PREFIX) ? key : `${APP_PREFIX}${key}`;
}

/**
 * Keys removed by {@link clearAppStorage} (e.g. on logout).
 */
export const STORAGE_KEYS = {
	USER: `${APP_PREFIX}user`,
	SESSION_INITIALIZED: `${APP_PREFIX}session_initialized`,
	THEME: `${APP_PREFIX}theme`
} as const;

/**
 * Set an item in localStorage with automatic JSON serialization
 */
export function setStorageItem<T>(key: string, value: T): void {
	try {
		const keyWithPrefix = getKeyWithPrefix(key);

		const serialized = JSON.stringify(value);
		localStorage.setItem(keyWithPrefix, serialized);
	} catch (error) {
		console.error('Error saving to localStorage:', error);
	}
}

/**
 * Get an item from localStorage with automatic JSON deserialization
 */
export function getStorageItem<T>(key: string): T | null {
	try {
		const keyWithPrefix = getKeyWithPrefix(key);

		const item = localStorage.getItem(keyWithPrefix);
		if (item === null) {
			return null;
		}

		return JSON.parse(item) as T;
	} catch (error) {
		console.error('Error reading from localStorage:', error);

		return null;
	}
}

/**
 * Remove an item from localStorage
 */
export function removeStorageItem(key: string): void {
	try {
		const keyWithPrefix = getKeyWithPrefix(key);
		localStorage.removeItem(keyWithPrefix);
	} catch (error) {
		console.error('Error removing from localStorage:', error);
	}
}

/**
 * Clears session-related entries ({@link STORAGE_KEYS}) from localStorage (e.g. on logout).
 */
export function clearAppStorage(): void {
	try {
		Object.values(STORAGE_KEYS).forEach((key) => {
			const keyWithPrefix = getKeyWithPrefix(key);
			localStorage.removeItem(keyWithPrefix);
		});
	} catch (error) {
		console.error('Error clearing localStorage:', error);
	}
}

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
	try {
		const testKey = `${APP_PREFIX}test`;
		const keyWithPrefix = getKeyWithPrefix(testKey);

		localStorage.setItem(keyWithPrefix, 'test');
		localStorage.removeItem(keyWithPrefix);

		return true;
	} catch {
		return false;
	}
}
