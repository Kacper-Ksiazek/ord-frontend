<script lang="ts">
	import type { LanguageName } from '$lib/types/core/domain/languages';
	import { cn } from '$lib/utils/cn';

	interface Props {
		language: LanguageName;
		class?: string;
	}

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

	let { language, class: className }: Props = $props();

	const flagCode = $derived(languageFlags[language] ?? 'un');
</script>

<span
	class={cn('inline-block h-4 w-6 shrink-0 overflow-hidden rounded-sm bg-line', className)}
	aria-hidden="true"
>
	<img
		src={`https://flagcdn.com/w160/${flagCode}.png`}
		alt=""
		class="size-full object-cover object-center"
		width="24"
		height="16"
		loading="lazy"
		decoding="async"
	/>
</span>
