<script lang="ts">
	import { cn } from '$lib/utils/cn';

	interface Props {
		class?: string;
		size?: 'sm' | 'md';
	}

	const { class: className = '', size = 'sm' }: Props = $props();

	const px = $derived(size === 'md' ? 'size-5' : 'size-4');
</script>

<span
	class={cn(
		'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
		px,
		className
	)}
	aria-hidden="true"
></span>
