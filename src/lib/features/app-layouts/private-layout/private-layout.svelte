<script lang="ts">
	import { Sidebar } from './components';

	const { children } = $props();
</script>

<div class="flex h-screen">
	<Sidebar />

	<div class="flex-1 overflow-auto flex flex-col bg-black p-2">
		<main class="app-bg-col h-full w-full overflow-hidden rounded-md">
			{@render children()}
		</main>
	</div>
</div>
