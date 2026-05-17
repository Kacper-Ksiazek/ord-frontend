<script lang="ts">
	import { Dropdown, DropdownItem, cn } from 'flowbite-svelte';
	import { ChevronDown } from 'lucide-svelte';
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import CountryFlag from '$lib/assets/images/country_flags/country_flag.svelte';
	import type { LanguageName } from '$auth/types';

	type Locale = 'en' | 'pl' | 'de';

	let currentLocale = $state(getLocale());

	const languages: Array<{ code: Locale; name: string; label: string; languageName: LanguageName }> =
		[
			{ code: 'en', name: 'English', label: 'EN', languageName: 'ENGLISH' },
			{ code: 'pl', name: 'Polski', label: 'PL', languageName: 'POLISH' },
			{ code: 'de', name: 'Deutsch', label: 'DE', languageName: 'GERMAN' }
		];

	function handleLanguageSelect(languageCode: Locale) {
		setLocale(languageCode);
		currentLocale = languageCode;
	}

	const currentLanguage = $derived(
		languages.find((lang) => lang.code === currentLocale) ?? languages[0]
	);
</script>

<button
	class="p-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50
		focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-600
		dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600
		flex items-center gap-1.5"
	aria-label="Change language"
	type="button"
>
	<CountryFlag flag={currentLanguage.languageName} class="w-5 h-5" />
	<span class="text-sm font-medium">{currentLanguage.label}</span>
	<ChevronDown class="w-3 h-3" />
</button>

<Dropdown class="w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
	{#each languages as language (language.code)}
		<DropdownItem
			onclick={() => handleLanguageSelect(language.code)}
			class={cn(
				'w-full list-none text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2',
				currentLocale === language.code && 'font-semibold'
			)}
		>
			<CountryFlag flag={language.languageName} class="w-4 h-4" />
			{language.name}
		</DropdownItem>
	{/each}
</Dropdown>
