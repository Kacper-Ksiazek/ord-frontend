<script lang="ts">
import { fade } from 'svelte/transition';
import { sidebarStore } from '../sidebar.store.svelte';

interface Props {
	language?: string;
}

const languageFlags: Record<string, string> = {
	ENGLISH: 'gb',
	SPANISH: 'es',
	FRENCH: 'fr',
	GERMAN: 'de',
	ITALIAN: 'it',
	PORTUGUESE: 'pt',
	DUTCH: 'nl',
	POLISH: 'pl',
	RUSSIAN: 'ru',
	CHINESE: 'cn',
	JAPANESE: 'jp',
	KOREAN: 'kr'
};

let { language = 'English' }: Props = $props();

const countryCode = $derived(languageFlags[language.toUpperCase()] || 'world');
const flagUrl = $derived(`https://flagcdn.com/w80/${countryCode}.png`);
</script>

<div class="bg-primary-500/20 rounded-lg p-2 mx-3 my-2 transition-all duration-300" style="transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);">
	<div class="flex items-center gap-2 h-9">
		<img src={flagUrl} alt={language} class="w-6 h-4 rounded" />

		{#if sidebarStore.isExpanded}
			<div class="flex-1 min-w-0" transition:fade={{ duration: 300, delay: 150 }}>
				<p class="text-xs text-sky-200">Currently learning</p>
				<p class="text-sm font-semibold text-sky-50 truncate">{language}</p>
			</div>
		{/if}
	</div>
</div>
