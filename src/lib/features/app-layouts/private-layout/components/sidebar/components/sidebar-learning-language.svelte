<script lang="ts">
	import { DropdownMenu } from 'bits-ui';
	import { ChevronDown, Plus } from 'lucide-svelte';
	import { authStore } from '$auth/stores';
	import CountryFlag from '$lib/assets/images/country-flags/country-flag.svelte';
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { sidebarStore } from '../sidebar.store.svelte';

	interface Props {
		language?: LanguageName;
	}

	const LANGUAGE_LABELS: Record<LanguageName, string> = {
		ENGLISH: 'English',
		POLISH: 'Polish',
		GERMAN: 'German',
		FRENCH: 'French',
		SPANISH: 'Spanish',
		ITALIAN: 'Italian',
		NORWEGIAN: 'Norwegian',
		RUSSIAN: 'Russian',
		SLOVENIAN: 'Slovenian'
	};

	const AVAILABLE_LANGUAGES = Object.keys(LANGUAGE_LABELS) as LanguageName[];

	const COUNTRY_FLAG_LANGUAGES = new Set<LanguageName>(['ENGLISH', 'POLISH', 'GERMAN']);

	const languageFlags: Record<LanguageName, string> = {
		ENGLISH: 'gb',
		SPANISH: 'es',
		FRENCH: 'fr',
		GERMAN: 'de',
		ITALIAN: 'it',
		POLISH: 'pl',
		RUSSIAN: 'ru',
		NORWEGIAN: 'no',
		SLOVENIAN: 'si'
	};

	const menuItemClasses =
		'flex h-10 w-full cursor-pointer items-center gap-2 rounded-md px-2 text-sm text-ink outline-none hover:bg-accent-soft';

	let { language = 'ENGLISH' }: Props = $props();

	const displayLanguage = $derived(language);
	const displayLabel = $derived(LANGUAGE_LABELS[displayLanguage] ?? displayLanguage);
	const isExpanded = $derived(sidebarStore.isExpanded);

	const triggerClasses = $derived(
		cn(
			'flex h-12 w-full shrink-0 items-center rounded-lg border border-line bg-surface px-2 text-left transition-colors',
			'hover:bg-accent-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/20',
			isExpanded ? 'gap-2 justify-start' : 'justify-center'
		)
	);

	const labelClasses = $derived(
		cn(
			'flex h-8 min-w-0 flex-1 flex-col justify-center overflow-hidden text-left transition-[max-width,opacity] duration-300 ease-in-out',
			isExpanded ? 'max-w-full opacity-100' : 'max-w-0 flex-none opacity-0'
		)
	);

	const chevronClasses = $derived(
		cn(
			'h-4 w-4 shrink-0 text-ink-subtle transition-[opacity,width] duration-300 ease-in-out',
			isExpanded ? 'opacity-100' : 'w-0 opacity-0'
		)
	);

	function handleLanguageSelect(nextLanguage: LanguageName) {
		if (!authStore.user || nextLanguage === authStore.user.selectedLearningLanguage) {
			return;
		}

		authStore.setUser({
			...authStore.user,
			selectedLearningLanguage: nextLanguage
		});
	}

	function handleAddNewLanguage() {}
</script>

{#snippet languageFlag(languageName: LanguageName, className = 'w-6 h-4 shrink-0 rounded-sm')}
	{#if COUNTRY_FLAG_LANGUAGES.has(languageName)}
		<CountryFlag flag={languageName} class={className} />
	{:else}
		<img
			src={`https://flagcdn.com/w80/${languageFlags[languageName] ?? 'world'}.png`}
			alt=""
			class={className}
		/>
	{/if}
{/snippet}

<div class="mx-3 my-2 h-12 shrink-0">
	<DropdownMenu.Root>
		<DropdownMenu.Trigger class={triggerClasses} aria-label="Change learning language">
			{@render languageFlag(displayLanguage)}

			<div class={labelClasses} aria-hidden={!isExpanded}>
				<p class="truncate text-xs leading-4 text-ink-muted">Currently learning</p>
				<p class="truncate text-sm font-semibold leading-4 text-ink">{displayLabel}</p>
			</div>

			<ChevronDown class={cn(chevronClasses, isExpanded && 'ml-auto')} aria-hidden="true" />
		</DropdownMenu.Trigger>

		<DropdownMenu.Portal>
			<DropdownMenu.Content
				class="overlay-surface z-50 mt-1 w-52 p-1"
				align="start"
				side={isExpanded ? 'bottom' : 'right'}
				sideOffset={8}
			>
				{#each AVAILABLE_LANGUAGES as languageName (languageName)}
					<DropdownMenu.Item
						onSelect={() => handleLanguageSelect(languageName)}
						class={cn(menuItemClasses, displayLanguage === languageName && 'bg-accent-soft font-medium')}
					>
						{@render languageFlag(languageName, 'h-4 w-6 shrink-0 rounded-sm')}
						<span class="truncate">{LANGUAGE_LABELS[languageName]}</span>
					</DropdownMenu.Item>
				{/each}

				<DropdownMenu.Separator class="my-1 h-px bg-line" />

				<DropdownMenu.Item onSelect={handleAddNewLanguage} class={menuItemClasses}>
					<Plus class="size-4 shrink-0 text-ink-subtle" aria-hidden="true" />
					<span class="truncate">{m['features.app-layouts.sidebar-learning-language.add_new']()}</span>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Portal>
	</DropdownMenu.Root>
</div>
