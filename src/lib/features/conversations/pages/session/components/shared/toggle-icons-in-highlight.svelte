<script lang="ts">
	import { Toggle } from 'flowbite-svelte';

	interface ToggleIconsInHighlightProps {
		checked: boolean;
	}

	let { checked = $bindable() }: ToggleIconsInHighlightProps = $props();
</script>

<div class="flex items-center">
	<Toggle bind:checked size="small">
		<span class="text-sm font-normal">Pokaż ikony</span>
	</Toggle>
</div>
