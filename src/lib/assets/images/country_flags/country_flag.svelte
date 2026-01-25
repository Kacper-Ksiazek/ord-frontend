<script lang="ts">
	import De from './flags/de.svelte';
	import Gb from './flags/gb.svelte';
	import Pl from './flags/pl.svelte';
	import type { SVGIconProps } from '$lib/assets/images/types';
	import type { Component } from 'svelte';

	interface CountryFlagProps extends SVGIconProps {
		locale: 'en' | 'pl' | 'de';
	}

	const { locale, ...restProps }: CountryFlagProps = $props();

	const flagComponents = new Map<'en' | 'pl' | 'de', Component>([
		['de', De],
		['en', Gb],
		['pl', Pl]
	]);

	const FlagComponent = $derived(flagComponents.get(locale));
</script>

{#if FlagComponent}
	<FlagComponent {...restProps} />
{/if}
