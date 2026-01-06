<script lang="ts">
	import { cn, Toggle } from 'flowbite-svelte';

	interface ToggleIconsInHighlightProps {
		checked: boolean;
	}

	let { checked = $bindable() }: ToggleIconsInHighlightProps = $props();
</script>

<div
	class="flex items-center"
	onclick={(e) => {
		e.stopPropagation();
	}}
	onkeydown={(e) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.stopPropagation();
			checked = !checked;
		}
	}}
	role="button"
	tabindex="0"
>
	<Toggle
		bind:checked
		size="small"
		class="cursor-pointer"
		classes={{
			span: cn(
				checked
					? 'hover:bg-primary-400 dark:hover:bg-primary-800'
					: 'hover:bg-gray-100 dark:hover:bg-gray-800'
			)
		}}
	>
		<span class="text-sm font-normal">Pokaż ikony</span>
	</Toggle>
</div>
