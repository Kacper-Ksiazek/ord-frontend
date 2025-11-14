<script lang="ts">
import LogoDark from '$lib/assets/images/logo-dark.png';
import LogoLight from '$lib/assets/images/logo-light.png';
import { themeStore } from '$lib/stores/theme.svelte';

interface Props {
	size?: 'sm' | 'md' | 'lg';
}

let { size = 'md' }: Props = $props();

const sizeClasses = {
	sm: 'h-6 w-auto',
	md: 'h-12 w-auto',
	lg: 'h-32 w-32'
};
</script>

<img
	src={themeStore.isDark ? LogoDark : LogoLight}
	alt="App Logo"
	class="{sizeClasses[size]} object-contain"
/>
