<script lang="ts">
	import type { SVGIconProps } from '$lib/assets/images/types';
	import {
		ORD_LOGO_BLOB_PATHS,
		ORD_LOGO_INNER_PATH,
		ORD_LOGO_OUTER_PATH
	} from '$lib/components/ord-logo/ord-logo.constants';

	const { class: className = '' }: SVGIconProps = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	viewBox="0 0 675 679"
	class={className}
	role="img"
	aria-label="ORD"
>
	<path fill="currentColor" fill-rule="evenodd" d={ORD_LOGO_INNER_PATH} />
	<path fill="currentColor" fill-rule="evenodd" d={ORD_LOGO_OUTER_PATH} />
	{#each ORD_LOGO_BLOB_PATHS as d (d)}
		<path fill="currentColor" {d} />
	{/each}
</svg>
