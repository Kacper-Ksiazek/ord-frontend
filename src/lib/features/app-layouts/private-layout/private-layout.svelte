<script lang="ts">
	import { MobileTopBar, Sidebar } from './components';

	const { children } = $props();
</script>

<div class="flex h-dvh bg-canvas">
	<Sidebar />

	<div class="flex min-w-0 flex-1 flex-col overflow-auto">
		<MobileTopBar />

		<!-- Phones: subtract the h-14 top bar so full-height screens (session) fit the viewport. -->
		<main class="min-h-[calc(100%-3.5rem)] w-full md:min-h-full">
			{@render children()}
		</main>
	</div>
</div>
