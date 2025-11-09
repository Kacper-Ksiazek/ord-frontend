<script lang="ts">
import { Dropdown, DropdownItem } from 'flowbite-svelte';
import { ChevronDownOutline, GlobeSolid } from 'flowbite-svelte-icons';
import { getLocale, setLocale } from '$lib/paraglide/runtime';

type Locale = 'en' | 'pl' | 'de';

let currentLocale = $state(getLocale());

const languages: Array<{ code: Locale; name: string; label: string }> = [
	{ code: 'en', name: 'English', label: 'EN' },
	{ code: 'pl', name: 'Polski', label: 'PL' },
	{ code: 'de', name: 'Deutsch', label: 'DE' }
];

function handleLanguageSelect(languageCode: Locale) {
	setLocale(languageCode);
	currentLocale = languageCode;
}

const currentLanguageLabel = $derived(
	languages.find((lang) => lang.code === currentLocale)?.label ?? 'EN'
);
</script>

<button
	class="p-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
		focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600
		dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600
		transition-colors flex items-center gap-1.5"
	aria-label="Change language"
	type="button"
>
	<GlobeSolid class="w-5 h-5" />
	<span class="text-sm font-medium">{currentLanguageLabel}</span>
	<ChevronDownOutline class="w-3 h-3" />
</button>

<Dropdown class="w-40">
	{#each languages as language}
		<DropdownItem
			onclick={() => handleLanguageSelect(language.code)}
			class="w-full list-none {currentLocale === language.code ? 'font-semibold' : ''}"
		>
			{language.name}
		</DropdownItem>
	{/each}
</Dropdown>
