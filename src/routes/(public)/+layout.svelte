<script lang="ts">
	import { PublicLayout } from '$lib/features/app-layouts';

	const { children } = $props();
</script>

<PublicLayout>
	{@render children()}
</PublicLayout>
