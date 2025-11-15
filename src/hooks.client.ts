/**
 * Client-side hooks for authentication
 * Runs once when the app initializes in the browser
 */

import { goto } from '$app/navigation';
import { getStorageItem, STORAGE_KEYS, setStorageItem } from '$lib/utils/local-storage';

let sessionInitialized = false;

export async function handleError({ error }: { error: unknown }) {
	console.error('Client error:', error);
	return {
		message: 'An unexpected error occurred'
	};
}

// This runs on every navigation, but we only check auth once per session
export function onNavigate() {
	// Only run auth check once per browser session
	if (sessionInitialized) {
		return;
	}

	sessionInitialized = true;

	// Mark session as initialized in localStorage
	setStorageItem(STORAGE_KEYS.SESSION_INITIALIZED, true);

	// Check if user exists in localStorage
	const storedUser = getStorageItem(STORAGE_KEYS.USER);

	// If no user found and not on login page, redirect to login
	if (!storedUser && !window.location.pathname.startsWith('/login')) {
		goto('/login');
	}
}
