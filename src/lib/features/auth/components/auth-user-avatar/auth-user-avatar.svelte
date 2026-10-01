<script lang="ts">
	import gravatarUrl from 'gravatar-url';
	import { authStore } from '$auth/stores';
	import { RemoteImage } from '$lib/components/utils/remote-image';
	import { cn } from '$lib/utils/cn';

	interface AuthUserAvatarProps {
		size?: number;
		class?: string;
	}

	const { size = 40, class: className }: AuthUserAvatarProps = $props();
</script>

{#if authStore.user?.email}
	<RemoteImage
		src={gravatarUrl(authStore.user.email, {
			size,
			default: 'identicon'
		})}
		alt="User avatar"
		class={cn('shrink-0 rounded-full', className)}
		style="width: {size}px; height: {size}px;"
		width={size}
		height={size}
	/>
{/if}
