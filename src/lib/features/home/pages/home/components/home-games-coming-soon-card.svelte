<script lang="ts">
	import { E2E_TEST_IDS } from '$home/testing/test-ids';
	import { Gamepad2 } from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages.js';
</script>

<div
	class="flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-6 text-center"
	data-testid={E2E_TEST_IDS.home.gamesCardEmpty}
>
	<div class="flex flex-col items-center gap-6">
		<div class="rounded-full bg-accent-soft p-4" aria-hidden="true">
			<Gamepad2 class="size-8 text-ink-muted" />
		</div>

		<div class="flex max-w-[18rem] flex-col items-center gap-2">
			<h2 class="text-xl font-semibold text-ink" data-testid={E2E_TEST_IDS.home.gamesComingSoon}>
				{m['features.home.home.count_card_empty.games_title']()}
			</h2>
			<p class="text-sm leading-relaxed text-ink-muted">
				{m['features.home.home.count_card_empty.games_description']()}
			</p>
		</div>
	</div>
</div>
