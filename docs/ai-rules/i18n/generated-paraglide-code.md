# Treat `src/lib/paraglide/` as build output — never edit it

The Paraglide Vite plugin (`vite.config.ts`, `outdir: './src/lib/paraglide'`) generates `src/lib/paraglide/` at build/dev time. It is gitignored and eslint-ignored; never edit, commit, or lint-fix files inside it. If a message is missing or wrong, fix `messages/source/` and re-run `bun run aggregate` + dev/build. The old `src/paraglide/` location no longer exists — never import from it or recreate it.

## Good

```ts
// vite.config.ts — the only place the output location is configured
paraglideVitePlugin({
	project: './project.inlang',
	outdir: './src/lib/paraglide'
});

// Consumers import from the generated output only
import * as m from '$lib/paraglide/messages.js';
import { paraglideMiddleware } from '$lib/paraglide/server';
```

## Bad

```ts
// Hand-editing generated output — wiped on the next build
// src/lib/paraglide/messages/en.js
export const auth_login_title = () => 'Patched title';

// Importing from the dead legacy location
import * as m from '../../paraglide/messages';
```
