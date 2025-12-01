<script lang="ts">
	interface AiMessageProps {
		message: string;
		isStillGenerating: boolean;
	}

	const { message, isStillGenerating }: AiMessageProps = $props();
</script>

<div class="flex flex-col gap-4">
	<span class="text-sm text-gray-500 dark:text-gray-400">
		{message}
	</span>
</div>
