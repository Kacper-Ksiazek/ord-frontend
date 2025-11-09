import { browser } from '$app/environment';
import { getStorageItem, STORAGE_KEYS, setStorageItem } from '$lib/utils/local-storage';

type Theme = 'light' | 'dark';

class ThemeStore {
	theme = $state<Theme>(
		// Initialize from DOM to match the inline script in app.html
		browser && document.documentElement.classList.contains('dark') ? 'dark' : 'light'
	);

	constructor() {
		if (browser) {
			this.loadTheme();
			this.applyTheme();
		}
	}

	loadTheme() {
		const stored = getStorageItem<Theme>(STORAGE_KEYS.THEME);
		if (stored === 'light' || stored === 'dark') {
			this.theme = stored;
		} else {
			const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
			this.theme = prefersDark ? 'dark' : 'light';
		}
	}

	toggle() {
		this.theme = this.theme === 'light' ? 'dark' : 'light';
		this.applyTheme();
		this.saveTheme();
	}

	setTheme(theme: Theme) {
		this.theme = theme;
		this.applyTheme();
		this.saveTheme();
	}

	applyTheme() {
		if (!browser) return;

		if (this.theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}

	saveTheme() {
		if (!browser) return;
		setStorageItem(STORAGE_KEYS.THEME, this.theme);
	}

	get isDark(): boolean {
		return this.theme === 'dark';
	}
}

export const themeStore = new ThemeStore();
