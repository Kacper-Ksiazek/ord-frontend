<script lang="ts">
	import { Sidebar } from './components';

	const { children } = $props();
</script>

<div class="flex h-screen bg-canvas">
	<Sidebar />

	<div class="flex min-w-0 flex-1 flex-col overflow-auto">
		<main class="h-full w-full overflow-hidden">
			{@render children()}
		</main>
	</div>
</div>
