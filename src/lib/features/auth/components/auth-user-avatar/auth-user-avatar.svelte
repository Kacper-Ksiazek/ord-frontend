<script lang="ts">
	import gravatarUrl from 'gravatar-url';
	import { authStore } from '$auth/stores';
	import { cn } from 'flowbite-svelte';

	interface AuthUserAvatarProps {
		size?: number;
		class?: string;
	}

	const { size = 40, class: className }: AuthUserAvatarProps = $props();
</script>

{#if authStore.user}
	<img
		src={gravatarUrl(authStore.user.email, {
			size,
			default: 'identicon'
		})}
		alt="User avatar"
		class={cn('rounded-full shrink-0', className)}
		style="width: {size}px; height: {size}px;"
	/>
{/if}
