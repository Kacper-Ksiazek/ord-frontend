<script lang="ts">
	import { page } from '$app/state';
	import { PublicLayout } from '$appLayouts';

	const { children } = $props();

	const showHeader = $derived(page.url.pathname !== '/login');
</script>

<PublicLayout {showHeader}>
	{@render children()}
</PublicLayout>
