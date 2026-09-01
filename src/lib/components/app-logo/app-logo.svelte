<script lang="ts">
	import { OrdLogo, type OrdLogoSize } from '$lib/components/ord-logo';

	interface Props {
		size?: OrdLogoSize;
		class?: string;
	}

	let { size = 'md', class: className = '' }: Props = $props();
</script>

<OrdLogo {size} class={className} />
