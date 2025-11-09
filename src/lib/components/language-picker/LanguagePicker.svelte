<script lang="ts">
import { Dropdown, DropdownItem } from 'flowbite-svelte';
import { ChevronDownOutline, GlobeSolid } from 'flowbite-svelte-icons';
import { getLocale, setLocale } from '$lib/paraglide/runtime';

type Locale = 'en' | 'pl' | 'de';

let currentLocale = $state(getLocale());

const languages: Array<{ code: Locale; name: string }> = [
	{ code: 'en', name: 'English' },
	{ code: 'pl', name: 'Polski' },
	{ code: 'de', name: 'Deutsch' }
];

function handleLanguageSelect(languageCode: Locale) {
	setLocale(languageCode);
	currentLocale = languageCode;
}
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
	<ChevronDownOutline class="w-3 h-3" />
</button>

<Dropdown>
	{#each languages as language}
		<DropdownItem
			onclick={() => handleLanguageSelect(language.code)}
			class={currentLocale === language.code ? 'font-semibold' : ''}
		>
			{language.name}
		</DropdownItem>
	{/each}
</Dropdown>
