<script lang="ts">
	import { RemoteImage } from '$lib/components/utils/remote-image';
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

<RemoteImage
	src={`https://flagcdn.com/w160/${flagCode}.png`}
	alt=""
	class={cn('h-4 w-6 shrink-0 rounded-sm', className)}
	width={24}
	height={16}
	loading="lazy"
	decoding="async"
/>
