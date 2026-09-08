<script lang="ts">
	import { Button } from '$lib/components/buttons/button';
	import { cn } from '$lib/utils/cn';
	import * as m from '$lib/paraglide/messages.js';
	import { toast } from './toast';

	let open = $state(false);
	let customMessage = $state('Custom toast message for UI testing');

	const scenarios = [
		{
			label: 'Activate success',
			action: () => toast.success(m['features.words.inbox.toast.activate_success']())
		},
		{
			label: 'Activate error',
			action: () => toast.error(m['features.words.inbox.toast.activate_error']())
		},
		{
			label: 'Activate many success',
			action: () => toast.success(m['features.words.inbox.toast.activate_many_success']({ count: 3 }))
		},
		{
			label: 'Activate many error',
			action: () => toast.error(m['features.words.inbox.toast.activate_many_error']())
		},
		{
			label: 'Remove success',
			action: () => toast.success(m['features.words.inbox.toast.remove_success']())
		},
		{
			label: 'Remove error',
			action: () => toast.error(m['features.words.inbox.toast.remove_error']())
		},
		{
			label: 'Remove many success',
			action: () => toast.success(m['features.words.inbox.toast.remove_many_success']({ count: 5 }))
		},
		{
			label: 'Remove many error',
			action: () => toast.error(m['features.words.inbox.toast.remove_many_error']())
		},
		{
			label: 'Long API error',
			action: () =>
				toast.error(
					'Progress for word 463e0942-76f5-449a-827a-8c695aef1a06 not found — this is a longer API message to test wrapping.'
				)
		},
		{
			label: 'Stack 3 toasts',
			action: () => {
				toast.success(m['features.words.inbox.toast.activate_success']());
				toast.error(m['features.words.inbox.toast.remove_error']());
				toast.success(m['features.words.inbox.toast.remove_many_success']({ count: 2 }));
			}
		},
		{
			label: 'AI → success',
			action: () => {
				const aiToast = toast.aiProgress(
					m['components.utils.toast.ai_thinking_1'](),
					m['components.utils.toast.title_ai_pending']()
				);

				setTimeout(() => {
					aiToast.success(m['features.words.inbox.detail.generate_with_ai_success']());
				}, 3200);
			}
		},
		{
			label: 'AI → error',
			action: () => {
				const aiToast = toast.aiProgress(
					m['components.utils.toast.ai_thinking_1'](),
					m['components.utils.toast.title_ai_pending']()
				);

				setTimeout(() => {
					aiToast.error(m['features.words.inbox.detail.generate_with_ai_error']());
				}, 2800);
			}
		}
	] as const;

	function triggerCustom(variant: 'success' | 'error') {
		const message = customMessage.trim();

		if (!message) {
			return;
		}

		if (variant === 'success') {
			toast.success(message);

			return;
		}

		toast.error(message);
	}
</script>

{#if import.meta.env.DEV}
	<div class="pointer-events-none fixed bottom-4 left-4 z-[100] flex flex-col items-start gap-2">
		<Button
			type="OUTLINED"
			variant="TEXT"
			class="pointer-events-auto !h-8 !px-3 !text-xs shadow-sm"
			onClick={() => (open = !open)}
		>
			{open ? 'Hide toast devtools' : 'Toast devtools'}
		</Button>

		{#if open}
			<div
				class={cn(
					'pointer-events-auto overlay-surface w-[min(320px,calc(100vw-2rem))] rounded-[10px] border border-line p-3 shadow-lg',
					'flex flex-col gap-3'
				)}
			>
				<div>
					<p class="text-xs font-semibold uppercase tracking-wide text-ink-muted">Presets</p>
					<div class="mt-2 grid grid-cols-2 gap-2">
						{#each scenarios as scenario (scenario.label)}
							<Button type="OUTLINED" variant="TEXT" class="!h-8 !px-2 !text-xs" onClick={scenario.action}>
								{scenario.label}
							</Button>
						{/each}
					</div>
				</div>

				<div>
					<label
						class="text-xs font-semibold uppercase tracking-wide text-ink-muted"
						for="toast-devtools-message"
					>
						Custom message
					</label>
					<textarea
						id="toast-devtools-message"
						bind:value={customMessage}
						rows="3"
						class="mt-2 w-full rounded-[10px] border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus-visible:ring-2 focus-visible:ring-ink/20"
					></textarea>
					<div class="mt-2 flex gap-2">
						<Button
							type="FILLED"
							variant="PRIMARY"
							class="!h-8 !px-3 !text-xs"
							onClick={() => triggerCustom('success')}
						>
							Success
						</Button>
						<Button
							type="OUTLINED"
							variant="DELETE"
							class="!h-8 !px-3 !text-xs"
							onClick={() => triggerCustom('error')}
						>
							Error
						</Button>
					</div>
				</div>
			</div>
		{/if}
	</div>
{/if}
