<script lang="ts">
	import { LanguagePicker, ThemeSwitcher } from '$appLayouts/shared';
	import { cn } from '$lib/utils/cn';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<div class={cn('relative flex h-[calc(100vh-40px)] w-full items-center justify-center bg-canvas')}>
	<header class="absolute top-10 left-10 z-10 flex items-center gap-2">
		<ThemeSwitcher />
		<LanguagePicker />
	</header>

	<div
		class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100%-64px)] flex justify-center max-w-[1200px]"
	>
		{@render children()}
	</div>
</div>
