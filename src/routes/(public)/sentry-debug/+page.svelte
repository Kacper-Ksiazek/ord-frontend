<script lang="ts">
	import { Button } from '$lib/components/buttons/button';
	import { triggerSentryTestError } from '$lib/sentry/trigger-test-error';

	let statusMessage = $state('');
	let isSending = $state(false);

	async function handleTrigger() {
		isSending = true;
		statusMessage = '';

		const result = await triggerSentryTestError();
		statusMessage = result.message;
		isSending = false;
	}
</script>

<main class="flex min-h-screen items-center justify-center p-6">
	<div class="flex w-full max-w-md flex-col gap-4 rounded-xl border border-border bg-surface p-6">
		<h1 class="text-lg font-semibold text-foreground">Sentry debug</h1>
		<p class="text-sm text-muted-foreground">
			Dev-only page. Sends a test error to the configured Sentry project.
		</p>

		<Button disabled={isSending} onClick={handleTrigger}>
			{isSending ? 'Sending…' : 'Trigger test error'}
		</Button>

		{#if statusMessage}
			<p class="text-sm text-foreground" role="status">{statusMessage}</p>
		{/if}
	</div>
</main>
