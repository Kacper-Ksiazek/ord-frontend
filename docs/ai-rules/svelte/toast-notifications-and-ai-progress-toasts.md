# Toast notifications and AI progress toasts

User feedback for mutations and AI calls goes through the shared `toast` helper in
`$lib/components/utils/toast`. `ToastContainer` is mounted once in `src/routes/+layout.svelte` —
do not add another container in features.

- **Instant feedback** — `toast.success` / `toast.error` for completed work that did not need a
  long-running “in progress” state (manual save, bookmark toggle failure, validation errors).
- **AI / long async work** — `toast.aiProgress(...)` at the start of the request, then call
  `.success(message)` or `.error(message)` on the **same** handle when the mutation settles.
  The toast morphs from `ai-pending` → `success` | `error` (no second toast for the same action).
- **Copy** — pending title/message from `components.utils.toast.*`; outcome messages from the
  feature’s message files. Use `getApiErrorMessage` for API failures.
- **Internals** — feature code must not import `toastStore` or push variants directly; only
  `toast` from the barrel.

While `variant === 'ai-pending'`, the UI cycles `ai_thinking_1` → `ai_thinking_2` →
`ai_thinking_3` automatically (`toast-item.svelte`). Pass `ai_thinking_1` as the initial
message so the first frame matches. Pending toasts do not auto-dismiss; success/error dismiss
after `TOAST_AUTO_DISMISS_MS`.

## Good

```ts
// capture-words-popover.svelte — AI fill gaps
import { toast } from '$lib/components/utils/toast';
import * as m from '$lib/paraglide/messages.js';
import { getApiErrorMessage } from '$lib/utils/get-api-error-message';

const aiToast = toast.aiProgress(
	m['components.utils.toast.ai_thinking_1'](),
	m['components.utils.toast.title_ai_pending']()
);

fillGapsMutation.mutate(payload, {
	onSuccess: (response) => {
		// …business logic…
		aiToast.success(m['features.words.capture-popover.toast.fill_success']({ count: items.length }));
	},
	onError: (error) => {
		aiToast.error(
			getApiErrorMessage(error, m['features.words.capture-popover.toast.fill_error']())
		);
	}
});
```

```ts
// word-detail-panel.svelte — non-AI save uses instant toast; AI generate uses progress toast
const aiToast = toast.aiProgress(
	m['components.utils.toast.ai_thinking_1'](),
	m['components.utils.toast.title_ai_pending']()
);

try {
	await generateWordManualMutation.mutateAsync(/* … */);
	aiToast.success(m['features.words.inbox.detail.generate_with_ai_success']());
} catch (error) {
	aiToast.error(
		getApiErrorMessage(error, m['features.words.inbox.detail.generate_with_ai_error']())
	);
}

// separate action, no in-flight AI state:
toast.success(m['features.words.inbox.detail.manual_save_success']());
```

## Bad

```ts
// Second toast instead of updating the AI progress handle
const aiToast = toast.aiProgress(m['components.utils.toast.ai_thinking_1']());
await mutateAsync();
toast.success('Done'); // leaves ai-pending toast stuck until user dismisses

// Bypassing the public API
import { toastStore } from '$lib/components/utils/toast/toast.store.svelte';
toastStore.push({ variant: 'success', message: 'Saved' });

// Hardcoded English instead of Paraglide
toast.error('Something went wrong');

// AI mutation with only toast.error on failure — no aiProgress while waiting
fillGapsMutation.mutate(payload, {
	onError: (error) => toast.error(getApiErrorMessage(error, fallback))
});
```
