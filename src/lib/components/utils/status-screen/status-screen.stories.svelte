<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import CenterComponentDecorator from '$lib/storybook/decorators/center-component-decorator.svelte';

	const { Story } = defineMeta({
		title: 'Utils/StatusScreen',
		decorators: [() => CenterComponentDecorator as any]
	});
</script>

<script lang="ts">
	import StatusScreen from './status-screen.svelte';
</script>

<Story name="All Variants">
	<div
		class="grid grid-cols-3 gap-px bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden w-full"
	>
		<div class="bg-gray-50 dark:bg-gray-900">
			<StatusScreen
				variant="error"
				code="Error 503"
				header="Something went wrong"
				description="We couldn't reach the server. Check your connection and try again."
				secondaryButton={{ label: 'Go home' }}
				primaryButton={{ label: 'Try again', onClick: () => alert('retry') }}
			/>
		</div>

		<div class="bg-gray-50 dark:bg-gray-900">
			<StatusScreen
				variant="information"
				header="No results found"
				description="Try adjusting your filters or search terms to find what you're looking for."
				primaryButton={{ label: 'Clear filters' }}
			/>
		</div>

		<div class="bg-gray-50 dark:bg-gray-900">
			<StatusScreen
				variant="success"
				header="All done!"
				description="Your changes have been saved successfully."
				secondaryButton={{ label: 'Keep editing' }}
				primaryButton={{ label: 'Continue' }}
			/>
		</div>
	</div>
</Story>
