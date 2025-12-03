<script lang="ts">
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

	interface MessageBaseProps {
		wrapperClass?: string;
		messageClass?: string;
		children?: Snippet;
		content?: Snippet;
	}

	const { wrapperClass = '', messageClass = '', children, content }: MessageBaseProps = $props();
</script>

<div
	class={cn(
		'w-[80%] text-lg', //
		wrapperClass
	)}
>
	{@render children?.()}

	{#if content}
		<div
			class={cn(
				'p-4 rounded-lg leading-relaxed tracking-wide min-w-[84px] min-h-[84px] bg-slate-100', //
				messageClass
			)}
		>
			{@render content()}
		</div>
	{/if}
</div>
