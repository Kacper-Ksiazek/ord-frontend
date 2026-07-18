# Path aliases

Use the feature aliases defined in `svelte.config.js` — `$auth`, `$conversations`, `$appLayouts` — plus `$lib` for shared code. Never use relative paths (`../../..`) or `$lib/features/...` paths to cross a feature boundary; relative imports are only for files within the same feature/page.

## Enforcing boundaries (future)

Cross-feature imports should go only through public barrels (`$auth`, `$conversations`, `$appLayouts`). To catch violations automatically, consider:

| Approach | Effort | Fit |
|----------|--------|-----|
| `@typescript-eslint/no-restricted-imports` | Low | Block deep paths like `$lib/features/<other>/pages/**` or relative `../../features/**` from feature files. Quick win, no new dependency. |
| `eslint-plugin-boundaries` | Medium | Define element types (`feature-auth`, `feature-conversations`, `shared`) and allowed import edges — closest to FSD's cross-slice rules. |
| `@feature-sliced/eslint-config` | High | Full FSD lint stack; overkill for a 3-feature hobby project. |

**Recommendation:** start with `no-restricted-imports` patterns blocking deep feature internals; upgrade to `eslint-plugin-boundaries` only if the rule set grows. Track as a separate task — not enforced in CI yet.

## Good

```svelte
<script lang="ts">
	import { AuthUserAvatar } from '$auth/components';
	import { E2E_TEST_IDS } from '$lib/testing/e2e-test-ids';
	import { CreateConversationForm } from './components'; // same page — relative is fine
</script>
```

## Bad

```svelte
<script lang="ts">
	import { AuthUserAvatar } from '../../../../auth/components'; // relative across features
	import { authStore } from '$lib/features/auth/stores'; // use $auth/stores instead
</script>
```
