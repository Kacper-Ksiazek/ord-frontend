<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Components/Navigation/Breadcrumb',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import { Breadcrumb } from './index';
	import { BarChart2, Home, Share2 } from 'lucide-svelte';
</script>

<Story name="Two Crumbs">
	<Breadcrumb crumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Reports' }]} />
</Story>

<Story name="Three Crumbs">
	<Breadcrumb
		crumbs={[
			{ label: 'Dashboard', href: '/' },
			{ label: 'Reports', href: '/reports' },
			{ label: 'Export' }
		]}
	/>
</Story>

<Story name="Four Crumbs">
	<Breadcrumb
		crumbs={[
			{ label: 'Dashboard', href: '/' },
			{ label: 'Reports', href: '/reports' },
			{ label: 'Social', href: '/reports/social' },
			{ label: 'Export' }
		]}
	/>
</Story>

<Story name="With Icons">
	<Breadcrumb
		crumbs={[
			{ label: 'Dashboard', icon: Home, href: '/' },
			{ label: 'Reports', icon: BarChart2, href: '/reports' },
			{ label: 'Social', icon: Share2 }
		]}
	/>
</Story>

<Story name="With onClick">
	<Breadcrumb
		crumbs={[
			{
				label: 'Summary',
				onClick: () => console.log('Back to Summary')
			},
			{ label: 'Feedback' }
		]}
	/>
</Story>
