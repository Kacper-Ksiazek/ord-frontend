# Environment variables and secrets

Secrets (API keys, tokens, private URLs) belong on the **server** or in local `.env` files —
never committed. The browser bundle only receives **`PUBLIC_`** (Vite/SvelteKit public env) values
intended for clients.

- Do not paste secrets into components, Storybook, E2E fixtures, or rule examples.
- When adding env-driven behavior, document the variable in README or ord-ops — not inline in code
  comments with real values.
- After changing `.env` or env schema, restart the dev server (`make restart` per local-frontend
  refresh rules).

## Good

```ts
// $lib/api-client/axios.ts — base URL from public config only
const baseURL = import.meta.env.PUBLIC_API_BASE_URL;
```

## Bad

```ts
const OPENAI_KEY = 'sk-...'; // committed secret in source
```
