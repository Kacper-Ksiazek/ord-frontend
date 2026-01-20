<script lang="ts">
	import { Sidebar } from './components';

	const { children } = $props();
</script>

<div class="flex h-screen">
	<Sidebar />

	<main class="flex-1 overflow-auto flex flex-col">
		{@render children()}
	</main>
</div>
