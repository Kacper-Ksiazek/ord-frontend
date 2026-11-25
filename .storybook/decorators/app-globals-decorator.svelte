<script lang="ts">
	import { Tooltip } from 'bits-ui';
	import type { Snippet } from 'svelte';
	import type { Locale } from '$lib/paraglide/runtime';
	import { type Theme, themeStore } from '$lib/stores/theme.svelte';

	interface Props {
		theme: Theme;
		locale: Locale;
		children: Snippet;
	}

	const { theme, locale, children }: Props = $props();

	// Storybook builds the decorator chain inside a derived, so store writes must live in an effect.
	$effect.pre(() => {
		themeStore.setTheme(theme);
	});
</script>

<!-- Paraglide messages are read at render time, so a locale switch remounts the story. -->
<Tooltip.Provider delayDuration={200}>
	{#key locale}
		{@render children()}
	{/key}
</Tooltip.Provider>
