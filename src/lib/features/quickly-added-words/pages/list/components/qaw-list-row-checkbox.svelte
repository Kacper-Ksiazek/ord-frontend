<script lang="ts">
	import { cn } from 'flowbite-svelte';

	interface Props {
		checked: boolean;
		disabled?: boolean;
		ariaLabel: string;
		onCheckedChange: (checked: boolean) => void;
	}

	let { checked, disabled = false, ariaLabel, onCheckedChange }: Props = $props();
</script>

<input
	type="checkbox"
	{checked}
	{disabled}
	aria-label={ariaLabel}
	class={cn(
		'size-4 shrink-0 cursor-pointer rounded border-gray-300 text-primary-600',
		'focus:ring-2 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800',
		disabled && 'cursor-not-allowed opacity-50'
	)}
	onchange={(event) => onCheckedChange(event.currentTarget.checked)}
/>
