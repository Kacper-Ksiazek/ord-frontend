<script lang="ts">
	import De from './flags/de.svelte';
	import Gb from './flags/gb.svelte';
	import Pl from './flags/pl.svelte';
	import type { SVGIconProps } from '$lib/assets/images/types';
	import type { Component } from 'svelte';
	import type { LanguageName } from '$auth/types';

	interface CountryFlagProps extends SVGIconProps {
		flag: LanguageName;
	}

	const { flag, ...restProps }: CountryFlagProps = $props();

	const flagComponents = new Map<LanguageName, Component>([
		['GERMAN', De],
		['ENGLISH', Gb],
		['POLISH', Pl]
	]);

	const FlagComponent = $derived(flagComponents.get(flag));
</script>

{#if FlagComponent}
	<FlagComponent {...restProps} />
{/if}
