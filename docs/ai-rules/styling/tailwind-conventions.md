# Tailwind 4 utility-first styling

The project uses Tailwind CSS 4 via `@tailwindcss/vite` — configuration lives in CSS (`@theme`, `@custom-variant`, `@plugin`, `@source` in `src/app.css`), there is no `tailwind.config.js`. Style components with utility classes directly in markup; reserve custom CSS for global concerns in `src/app.css` and shared `@layer components` classes in `src/lib/styles/` (e.g. typography classes like `heading-1`, `body-small`). Use the `primary-*` palette from `@theme` for brand colors, and reuse existing shared classes (`app-bg-col`, typography) instead of redefining them.

## Good

```svelte
<!-- utilities in markup, theme palette, shared typography class -->
<div class="app-bg-col flex items-center gap-2 rounded-lg border border-gray-300 p-2.5">
	<h2 class="heading-3">Session summary</h2>
	<span class="text-primary-600 dark:text-primary-400">Active</span>
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
