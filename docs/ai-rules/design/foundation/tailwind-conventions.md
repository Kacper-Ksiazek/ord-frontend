# Tailwind 4 utility-first styling

The project uses Tailwind CSS 4 via `@tailwindcss/vite` — configuration lives in CSS (`@theme`, `@custom-variant`, `@plugin`, `@source` in `src/app.css`), there is no `tailwind.config.js`. Style components with utility classes directly in markup; reserve custom CSS for global concerns in `src/app.css` and shared `@layer components` classes in `src/lib/styles/` (e.g. typography classes like `heading-1`, `body-small`). Use Quiet studio tokens (`canvas`, `surface`, `ink`, `ink-body`, `line`, `accent`, `accent-soft`, `on-ink`) for chrome — `accent` (rose) is reserved for text links (`.link`), never for buttons, focus, or mistake/error feedback (which uses `danger` and the score tones) — they swap in `.dark`. Keep `primary-*` only for leftover brand ramps; filled primary actions stay `ink` (black) via the shared `Button` — do not fill buttons with `accent`. Use the radius scale (`rounded-chip` 0.5rem, `rounded-control` 0.75rem for buttons/fields/menus, `rounded-card` 1rem, `rounded-full` for icon-only pills) and the elevation scale (`shadow-soft`, `shadow-raised`, `shadow-overlay`) instead of arbitrary `rounded-[10px]` / `shadow-sm`. Keyboard focus is a neutral 2px `ink` outline offset 3px (global `:focus-visible` in `src/app.css`), and fields focus with an `ink` border; do not add per-component `focus:ring-*`. Animate only specific properties (`transition-colors`, `transition-[…]`) — there is no global `*` transition, and `prefers-reduced-motion` is honored globally.

## Good

```svelte
<div class="app-bg-col flex items-center gap-2 rounded-[10px] border border-line p-2.5">
	<h2 class="heading-3">Session summary</h2>
	<span class="text-ink-muted">Active</span>
</div>
```

## Bad

```svelte
<div class="stats-card">
	<h2 class="stats-card__title">Session summary</h2>
</div>

<style>
	/* don't write per-component CSS for things utilities cover */
	.stats-card {
		display: flex;
		align-items: center;
		gap: 8px;
		border: 1px solid #d1d5db; /* hardcoded color instead of theme palette */
		border-radius: 8px;
		padding: 10px;
	}
</style>
```
