<script lang="ts">
import clsx from 'clsx';
import Logo from '$lib/assets/images/logo.svg.svelte';
import { type Theme, themeStore } from '$lib/stores/theme.svelte';

interface Props {
	size?: 'sm' | 'md' | 'lg';
	class?: string;
}

let { size = 'md', class: className = '' }: Props = $props();

const sizeClasses = {
	sm: 'h-6 w-auto',
	md: 'h-12 w-auto',
	lg: 'h-32 w-32'
};

const colorClasses: Record<Theme, string> = {
	light: 'text-gray-900',
	dark: 'text-gray-50'
};
</script>

<Logo class={clsx(sizeClasses[size], className, colorClasses[themeStore.theme])} />
