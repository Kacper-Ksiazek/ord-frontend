<script lang="ts">
	import { LanguagePicker, ThemeSwitcher } from '$appLayouts/shared';
	import { cn } from 'flowbite-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
	}

	const { children }: Props = $props();
</script>

<div
	class={cn(
		'flex justify-center items-center w-full h-[calc(100vh-40px)] bg-gray-50 dark:bg-gray-900 position-relative',
		''
	)}
>
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
