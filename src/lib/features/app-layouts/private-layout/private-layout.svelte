<script lang="ts">
	import { Sidebar } from './components';

	const { children } = $props();
</script>

<div class="flex h-screen bg-canvas">
	<Sidebar />

	<div class="flex-1 overflow-auto flex flex-col">
		<main class="h-full w-full overflow-hidden">
			{@render children()}
		</main>
	</div>
</div>
