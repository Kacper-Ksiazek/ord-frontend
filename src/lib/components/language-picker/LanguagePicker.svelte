<script lang="ts">
import { GlobeSolid } from 'flowbite-svelte-icons';
import { getLocale, locales, setLocale } from '$lib/paraglide/runtime';

let currentLocale = $state(getLocale());

const languageLabels: Record<string, string> = {
	en: 'EN',
	pl: 'PL',
	de: 'DE'
};

function handleClick(event: MouseEvent) {
	const currentIndex = locales.indexOf(currentLocale as any);
	const nextIndex = (currentIndex + 1) % locales.length;
	const nextLocale = locales[nextIndex];

	setLocale(nextLocale);
	currentLocale = nextLocale;

	(event.currentTarget as HTMLButtonElement).blur();
}
</script>

<button
	onclick={handleClick}
	class="p-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
		focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600
		dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600
		transition-colors flex items-center gap-1.5"
	aria-label="Change language"
	type="button"
>
	<GlobeSolid class="w-5 h-5" />
	<span class="text-sm font-medium">{languageLabels[currentLocale]}</span>
</button>
