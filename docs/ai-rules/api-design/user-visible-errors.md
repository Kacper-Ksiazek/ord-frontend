# User-visible errors for failed requests

Canonical patterns: **[`design/patterns/states/loading-empty-error-states.md`](../design/patterns/states/loading-empty-error-states.md)** (StatusPanel, skeletons) and **[`toast-notifications-and-ai-progress.md`](../design/patterns/states/toast-notifications-and-ai-progress.md)** (mutation / AI feedback).

API callers should still surface failures to the UI layer; do not swallow errors in `http*` or query wrappers.
