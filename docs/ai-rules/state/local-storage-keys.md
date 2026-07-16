# Use the local-storage utils; register app-wide keys in `STORAGE_KEYS`, keep feature keys local

Always read/write localStorage through `getStorageItem` / `setStorageItem` / `removeStorageItem` from `$lib/utils/local-storage` (they add the `ord_app_` prefix and handle JSON + errors). Keys that must be cleared on logout (session/user-level) go into the central `STORAGE_KEYS` map in `src/lib/utils/local-storage.ts`; feature-private persistence keys are deliberately kept as local constants inside the feature module instead of polluting the central map.

## Good

```ts
// App-wide, session-scoped key — central STORAGE_KEYS (cleared by clearAppStorage on logout)
import { getStorageItem, STORAGE_KEYS, setStorageItem } from '$lib/utils/local-storage';

setStorageItem(STORAGE_KEYS.USER, user);

// Feature-private key — local constant in the feature store
// src/lib/features/conversations/pages/create/stores/topic-picker.store.svelte.ts
const TOPIC_PICKER_PINNED_TOPICS_STORAGE_KEY = 'create_conversation_topic_picker_pinned_topics';

setStorageItem(TOPIC_PICKER_PINNED_TOPICS_STORAGE_KEY, data);
```

## Bad

```ts
// Don't call localStorage directly — no prefix, no JSON handling, no error safety
localStorage.setItem('user', JSON.stringify(user));

// Don't add feature-private keys to the central map — STORAGE_KEYS is for
// session-level keys wiped by clearAppStorage on logout
export const STORAGE_KEYS = {
	// ...
	TOPIC_PICKER_PINNED_TOPICS: `${APP_PREFIX}create_conversation_topic_picker_pinned_topics`
} as const;
```
