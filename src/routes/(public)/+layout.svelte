<script lang="ts">
const { children } = $props();
</script>

<div class="min-h-screen bg-gray-50 flex items-center justify-center">
	{@render children()}
</div>
