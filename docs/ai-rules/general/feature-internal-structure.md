# Feature internal structure

Each feature under `src/lib/features/<feature>/` has a root `index.ts` barrel re-exporting its public sub-barrels, `pages/<page>/` folders containing a `*-screen.svelte` entry plus `components/`, `stores/` or `state/`, `services/`, `utils/` as needed, and a `shared/` folder for code reused across the feature's pages. Types live in `types/` and API code in `api-client/`.

## Good

```text
src/lib/features/conversations/
├── index.ts                  # root barrel: export * from './api-client'; export * from './types';
├── api-client/               # conversation/ and ongoing-conversation/ subdomains
├── types/                    # api/, domain/, ongoing-conversation/
├── pages/
│   ├── create/               # components/, stores/, services/, utils/, create-conversation-screen.svelte, index.ts
│   ├── list/                 # components/, state/, conversations-list-screen.svelte, index.ts
│   └── session/              # components/, contexts/, services/, conversation-session-screen.svelte, index.ts
└── shared/                   # components/, constants/, utils/ shared across pages
```

```typescript
// src/lib/features/conversations/pages/create/index.ts — page barrel
export { CreateConversationForm } from './components';
export { default as CreateConversationScreen } from './create-conversation-screen.svelte';
```

## Bad

```text
src/lib/features/conversations/
├── CreateConversationScreen.svelte   # page dumped at feature root, no pages/ folder
├── helpers.ts                        # unscoped grab-bag instead of pages/<page>/utils or shared/utils
└── components/                       # page-specific components mixed with cross-page ones
```
