<script lang="ts">
	import { PrivateAuthLayout } from '$auth/layouts';

	const { children, data } = $props();
</script>

<PrivateAuthLayout user={data.user}>
	{@render children()}
</PrivateAuthLayout>
