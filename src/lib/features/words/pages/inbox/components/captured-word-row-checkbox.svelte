<script lang="ts">
	import { cn } from '$lib/utils/cn';

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
		'size-4 shrink-0 cursor-pointer rounded border-line text-ink accent-ink',
		'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/15',
		disabled && 'cursor-not-allowed opacity-50'
	)}
	onchange={(event) => onCheckedChange(event.currentTarget.checked)}
/>
