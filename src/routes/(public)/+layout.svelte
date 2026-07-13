<script lang="ts">
	import { PublicLayout } from '$appLayouts';

	const { children } = $props();
</script>

<PublicLayout>
	{@render children()}
</PublicLayout>
