<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { ChevronDown } from 'lucide-svelte';
	import { getLocale, setLocale } from '$lib/paraglide/runtime';
	import CountryFlag from '$lib/assets/images/country-flags/country-flag.svelte';
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import { cn } from '$lib/utils/cn';

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

<DropdownMenu.Root>
	<DropdownMenu.Trigger
		class="flex items-center gap-1.5 rounded-[10px] border border-line bg-surface p-2.5 text-ink
			hover:bg-accent-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
		aria-label="Change language"
	>
		<CountryFlag flag={currentLanguage.languageName} class="w-5 h-5" />
		<span class="text-sm font-medium">{currentLanguage.label}</span>
		<ChevronDown class="w-3 h-3" />
	</DropdownMenu.Trigger>

	<DropdownMenu.Portal>
		<DropdownMenu.Content class="overlay-surface z-50 mt-1 w-40 p-1" align="end" sideOffset={4}>
			{#each languages as language (language.code)}
				<DropdownMenu.Item
					onSelect={() => handleLanguageSelect(language.code)}
					class={cn(
						'flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm text-ink',
						'outline-none hover:bg-accent-soft',
						currentLocale === language.code && 'font-medium'
					)}
				>
					<CountryFlag flag={language.languageName} class="w-4 h-4" />
					{language.name}
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>
