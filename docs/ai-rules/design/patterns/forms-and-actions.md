# Forms and actions

Forms use shared **`Input`**, **`Button`**, and related wrappers from `$lib/components/forms` and
`$lib/components/buttons`. Style with Quiet studio tokens (`border-line`, `bg-surface`, `text-ink`) —
see [`tailwind-conventions.md`](../foundation/tailwind-conventions.md).

## Actions

- **Primary** action: `Button` with `variant="PRIMARY"` (filled ink/surface pattern from design system).
- **Secondary / ghost**: existing `variant` values — do not invent new button CSS per screen.
- **Loading submit:** set `disabled` on the button; keep the label readable. Avoid **`Spinner`**
  inside buttons on new work — see [`loading-empty-error-states.md`](./loading-empty-error-states.md).
- **Destructive** flows: reuse existing patterns (danger tokens, confirmation dialogs via bits-ui
  wrappers if present).

## Forms

- Labels and validation messages through **Paraglide**.
- Multi-step flows (create conversation): one visible step at a time; summary step recaps choices —
  follow the create-conversation screen structure when adding similar wizards.
- Errors from API: map to field-level or form-level message; do not leave the user with a silent failure.

## Good

```svelte
<Button variant="PRIMARY" disabled={mutation.isPending} onClick={handleSubmit}>
	{m['features.conversation.create.form.submit']()}
</Button>
```

## Bad

```svelte
<button class="rounded bg-blue-600 px-4 py-2 text-white" onclick={handleSubmit}> Submit </button>
<!-- one-off colors, English label, no shared Button -->
```
