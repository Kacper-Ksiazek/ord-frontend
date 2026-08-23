# Path aliases

Use the feature aliases defined in `svelte.config.js` — `$auth`, `$conversations`, `$appLayouts`, `$quicklyAddedWords` — plus `$lib` for shared code. Never use relative paths (`../../..`) or `$lib/features/...` paths to cross a feature boundary; relative imports are only for files within the same feature/page. Cross-feature imports must go only through public barrels (`$auth`, `$conversations`, `$appLayouts`, `$quicklyAddedWords`).

ESLint enforces this via `@typescript-eslint/no-restricted-imports` in `eslint.config.js`: `$lib/features/*`, relative `**/features/*`, and sibling-feature relative paths (`../../../auth/*`, `../conversations/*`, `../app-layouts/*`, `../quickly-added-words/*`) fail lint. Use the alias barrels instead.

## Good

```svelte
<script lang="ts">
	import { AuthUserAvatar } from '$auth/components';
	import { E2E_TEST_IDS } from '$auth/testing/test-ids';
	import { CreateConversationForm } from './components'; // same page — relative is fine
</script>
```

## Bad

```svelte
<script lang="ts">
	import { AuthUserAvatar } from '../../../auth/components'; // relative across features
	import { authStore } from '$lib/features/auth/stores'; // use $auth/stores instead
</script>
```
