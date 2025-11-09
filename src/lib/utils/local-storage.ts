/**
 * Local storage utilities with app-specific prefix
 * All keys are automatically prefixed with 'ord_app_'
 */

const APP_PREFIX = 'ord_app_';

/**
 * Storage keys used throughout the application
 */
export const STORAGE_KEYS = {
	USER: `${APP_PREFIX}user`,
	SESSION_INITIALIZED: `${APP_PREFIX}session_initialized`
} as const;

/**
 * Set an item in localStorage with automatic JSON serialization
 */
export function setStorageItem<T>(key: string, value: T): void {
	try {
		const serialized = JSON.stringify(value);
		localStorage.setItem(key, serialized);
	} catch (error) {
		console.error('Error saving to localStorage:', error);
	}
}

/**
 * Get an item from localStorage with automatic JSON deserialization
 */
export function getStorageItem<T>(key: string): T | null {
	try {
		const item = localStorage.getItem(key);
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
		localStorage.removeItem(key);
	} catch (error) {
		console.error('Error removing from localStorage:', error);
	}
}

/**
 * Clear all app-specific items from localStorage
 */
export function clearAppStorage(): void {
	try {
		Object.values(STORAGE_KEYS).forEach((key) => {
			localStorage.removeItem(key);
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
		localStorage.setItem(testKey, 'test');
		localStorage.removeItem(testKey);
		return true;
	} catch {
		return false;
	}
}
