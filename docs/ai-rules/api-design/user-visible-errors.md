# User-visible errors for failed requests

Canonical patterns (StatusPanel, i18n, retry, forms): **[`patterns/states/loading-empty-error-states.md`](../design/patterns/states/loading-empty-error-states.md)** — Errors section.

API callers should still surface failures to the UI layer; do not swallow errors in `http*` or query wrappers.
