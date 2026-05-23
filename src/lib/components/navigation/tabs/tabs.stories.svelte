<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Navigation/Tabs',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import { Tabs } from './index';
	import { Home, Settings, User } from 'lucide-svelte';

	let activeTabUnderline = $state('home');
	let activeTabOutlined = $state('home');
</script>

<Story name="Default">
	<div class="space-y-8">
		<div>
			<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Underline Variant</h3>
			<Tabs
				tabs={[
					{ id: 'home', label: 'Home', icon: Home },
					{ id: 'profile', label: 'Profile', icon: User },
					{ id: 'settings', label: 'Settings', icon: Settings }
				]}
				bind:activeTab={activeTabUnderline}
				variant="underline"
			/>
			<p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
				Active tab: <strong>{activeTabUnderline}</strong>
			</p>
		</div>
		<div>
			<h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Outlined Variant</h3>
			<Tabs
				tabs={[
					{ id: 'home', label: 'Home', icon: Home },
					{ id: 'profile', label: 'Profile', icon: User },
					{ id: 'settings', label: 'Settings', icon: Settings }
				]}
				bind:activeTab={activeTabOutlined}
				variant="outlined"
			/>
			<p class="mt-4 text-sm text-gray-600 dark:text-gray-400">
				Active tab: <strong>{activeTabOutlined}</strong>
			</p>
		</div>
	</div>
</Story>
