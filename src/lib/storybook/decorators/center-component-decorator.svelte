<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<div
	class="flex justify-center items-center w-full h-[calc(100vh-40px)] bg-green-900/10 position-relative"
>
	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-64px)] flex justify-center"
	>
		{@render children()}
	</div>
</div>
