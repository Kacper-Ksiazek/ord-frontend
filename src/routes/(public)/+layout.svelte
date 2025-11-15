<script lang="ts">
const { children } = $props();
</script>

<div class="min-h-full flex items-center justify-center">
	{@render children()}
</div>
