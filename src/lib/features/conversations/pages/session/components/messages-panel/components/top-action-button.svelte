<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import { Button } from '$lib/components/buttons/button';
	import type { Snippet } from 'svelte';

	interface Props {
		ariaLabel: string;
		title: string;
		position?: 'left' | 'right';
		class?: string;
		disabled?: boolean;

		onClick: () => void;

		icon: LucideIcon;
		children?: Snippet;
	}

	const {
		icon: Icon,
		onClick,
		ariaLabel,
		title,
		position = 'right',
		class: customClass = '',
		disabled = false,
		children
	}: Props = $props();
</script>

<Button
	type="OUTLINED"
	variant="TEXT"
	{onClick}
	{ariaLabel}
	{title}
	{disabled}
	class={cn(
		'absolute z-10 h-auto! p-3 rounded-xl border-2 bg-white dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700',
		position === 'left' ? 'left-0 mr-auto' : 'right-0 ml-auto',
		customClass
	)}
>
	<Icon class="w-5 h-5" />

	{@render children?.()}
</Button>
