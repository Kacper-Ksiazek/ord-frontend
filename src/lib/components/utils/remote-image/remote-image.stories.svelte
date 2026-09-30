<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Utils/RemoteImage',
		decorators: [() => CenterComponentDecorator as never]
	});
</script>

<script lang="ts">
	import { RemoteImage } from './index';

	const flagSrc = `data:image/svg+xml,${encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="60" height="40"><rect width="60" height="40" fill="#012169"/><rect y="16" width="60" height="8" fill="#fff"/><rect x="26" width="8" height="40" fill="#fff"/></svg>'
	)}`;

	const avatarSrc = `data:image/svg+xml,${encodeURIComponent(
		'<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#d6d3d1"/><circle cx="40" cy="32" r="14" fill="#78716c"/><ellipse cx="40" cy="68" rx="22" ry="16" fill="#78716c"/></svg>'
	)}`;
</script>

<Story name="Default">
	<div class="flex items-center gap-6">
		<RemoteImage
			src={flagSrc}
			alt=""
			class="h-4 w-6 rounded-sm"
			width={24}
			height={16}
			loading="eager"
		/>
		<RemoteImage
			src={avatarSrc}
			alt="User avatar"
			class="size-10 rounded-full"
			width={40}
			height={40}
		/>
		<RemoteImage
			src="/__missing-remote-image__.png"
			alt=""
			class="h-4 w-6 rounded-sm"
			width={24}
			height={16}
		/>
	</div>
</Story>
