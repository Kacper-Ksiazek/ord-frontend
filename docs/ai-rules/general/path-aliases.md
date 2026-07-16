# Path aliases

Use the feature aliases defined in `svelte.config.js` — `$auth`, `$conversations`, `$appLayouts` — plus `$lib` for shared code. Never use relative paths (`../../..`) or `$lib/features/...` paths to cross a feature boundary; relative imports are only for files within the same feature/page.

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
