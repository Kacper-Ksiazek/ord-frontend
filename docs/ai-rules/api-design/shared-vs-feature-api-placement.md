# Place endpoints in the owning feature; shared `api-client/api/` only for cross-feature calls

Feature-owned endpoints live in `src/lib/features/{feature}/api-client/{subdomain?}/api/` (REST) or `.../sse/` (streams), imported via the feature alias (`$auth/api-client`, `$conversations/api-client`). Only endpoints with no owning feature (e.g. TTS used across the app) go in `src/lib/api-client/api/`. Large features may split into subdomains (e.g. `conversations` → `conversation/` and `ongoing-conversation/`), each with its own `api/`, `sse/`, `mutations/`, `queries/`, `keys.ts`.

## Good

```ts
// Feature-owned: src/lib/features/auth/api-client/api/http-post-request-otp.ts
// Cross-feature: src/lib/api-client/api/http-post-request-tts-audio.ts
// Subdomain:     src/lib/features/conversations/api-client/ongoing-conversation/api/http-post-save-user-message.ts

import { httpPostRequestTtsAudio } from '$lib/api-client';
import { createCreateConversationMutation } from '$conversations/api-client';
```

## Bad

```ts
// Auth endpoint dumped into the shared kernel:
// src/lib/api-client/api/http-post-verify-otp.ts  ← belongs to the auth feature

// Or a conversations endpoint placed flat, ignoring the subdomain split:
// src/lib/features/conversations/api-client/api/http-post-save-user-message.ts
// ← belongs under ongoing-conversation/api/
```
