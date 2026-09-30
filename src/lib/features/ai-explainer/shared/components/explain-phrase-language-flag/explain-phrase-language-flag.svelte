<script lang="ts">
	import LanguageNameFlag from '$lib/assets/images/country-flags/language-name-flag.svelte';
	import type { LanguageName } from '$lib/types/core/domain/languages';

	interface Props {
		language: LanguageName;
		class?: string;
	}

	let { language, class: className }: Props = $props();
</script>

<LanguageNameFlag {language} class={className} />
