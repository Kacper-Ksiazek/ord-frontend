# Toast notifications and AI progress toasts

Transient feedback for **user actions** (save, toggle, AI mutations) — not full-page load failures.
For blocking query errors and empty list states, use [`loading-empty-error-states.md`](./loading-empty-error-states.md)
(`StatusPanel`, skeletons).

User feedback goes through the shared `toast` helper in `$lib/components/utils/toast`.
`ToastContainer` is mounted once in `src/routes/+layout.svelte` — do not add another container in features.

- **Instant feedback** — `toast.success` / `toast.error` for work that did not need a visible
  in-progress state (manual save, bookmark failure, quick validation).
- **AI / long async work** — `toast.aiProgress(...)` when the request starts, then `.success(message)`
  or `.error(message)` on the **same** handle when it settles. The toast morphs
  `ai-pending` → `success` | `error` (no second toast for the same action).
- **Copy** — pending title/message from `components.utils.toast.*`; outcomes from feature message
  files. Use `getApiErrorMessage` for API failures.
- **Internals** — do not import `toastStore` or push variants directly; only `toast` from the barrel.

While `variant === 'ai-pending'`, the UI cycles `ai_thinking_1` → `ai_thinking_2` → `ai_thinking_3`
(`toast-item.svelte`). Pass `ai_thinking_1` as the initial message. Pending toasts do not auto-dismiss;
success/error dismiss after `TOAST_AUTO_DISMISS_MS`.

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
		aiToast.success(m['features.words.capture-popover.toast.fill_success']({ count: items.length }));
	},
	onError: (error) => {
		aiToast.error(getApiErrorMessage(error, m['features.words.capture-popover.toast.fill_error']()));
	}
});
```

```ts
// word-detail-panel.svelte — instant toast for manual save; aiProgress for AI generate
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

toast.success(m['features.words.inbox.detail.manual_save_success']());
```

## Bad

```ts
const aiToast = toast.aiProgress(m['components.utils.toast.ai_thinking_1']());
await mutateAsync();
toast.success('Done'); // leaves ai-pending toast stuck

import { toastStore } from '$lib/components/utils/toast/toast.store.svelte';
toastStore.push({ variant: 'success', message: 'Saved' });

toast.error('Something went wrong');

fillGapsMutation.mutate(payload, {
	onError: (error) => toast.error(getApiErrorMessage(error, fallback))
});
```
