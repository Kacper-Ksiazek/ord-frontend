# Deployment (Vercel)

Production deploys run automatically when changes land on `main` (merge a PR or push
directly). Pull requests get **preview deployments** with a unique URL.

The app uses `@sveltejs/adapter-vercel` and Bun (`bun.lock`). Vercel picks up build
settings from `vercel.json`.

## One-time setup

### 1. Create the Vercel project

1. Open [vercel.com/new](https://vercel.com/new) and import `Kacper-Ksiazek/ord-frontend`.
2. Confirm **Production Branch** is `main`.
3. Leave **Framework Preset** as SvelteKit (auto-detected).
4. Do **not** override install/build commands — `vercel.json` already sets them.

### 2. Environment variables

Add these in **Project → Settings → Environment Variables**:

| Variable         | Environments              | Value |
| ---------------- | ------------------------- | ----- |
| `GITHUB_TOKEN`   | Production, Preview, Development | GitHub PAT with `read:packages` (same token as local dev — used by `.npmrc` during `bun install`) |
| `PUBLIC_API_URL` | Production                | Production Ord API URL (e.g. `https://your-api.herokuapp.com`) |
| `PUBLIC_API_URL` | Preview, Development      | Staging or local API URL, depending on your setup |

`PUBLIC_API_URL` is baked in at build time (`$env/static/public`). Set a different
value per environment if previews should talk to a non-production API.

### 3. GitHub branch protection (recommended)

So deploy only happens after green CI:

1. **Repository → Settings → Branches → Branch protection rules** for `main`.
2. Enable **Require status checks to pass before merging**.
3. Require all CI jobs: `lint`, `format`, `types`, `build`, `unit-tests`.

Merge to `main` → CI must pass → Vercel builds and deploys production.

### 4. First deploy

Merge this branch (or push to `main`). Vercel builds on every push to `main` and on
every PR.

Check **Deployments** in the Vercel dashboard for build logs and the production URL.

## How it works

```text
PR opened/updated  →  Vercel preview deployment
PR merged to main  →  CI runs  →  Vercel production deployment
```

- **Install:** `bun install --frozen-lockfile` (private `@kacper-ksiazek/ord-api-types` via `GITHUB_TOKEN`)
- **Build:** `bun run aggregate` (prebuild) → `vite build` via SvelteKit adapter-vercel
- **Output:** Vercel serverless / edge functions (adapter default)

## Troubleshooting

| Symptom | Fix |
| ------- | --- |
| `401` / `404` installing `@kacper-ksiazek/ord-api-types` | Set `GITHUB_TOKEN` in Vercel env vars (PAT with `read:packages`). |
| `lockfile had changes, but lockfile is frozen` | Run `bun install` locally and commit `bun.lock`. |
| App loads but API calls fail | Check `PUBLIC_API_URL` for the target environment; rebuild after changing it. |
| Build passes locally, fails on Vercel | Compare Bun version — `package.json` `packageManager` should match local `bun --version`. |

## Manual deploy (optional)

```bash
npx vercel          # preview
npx vercel --prod   # production
```

Requires [Vercel CLI](https://vercel.com/docs/cli) and `vercel link` once per machine.
