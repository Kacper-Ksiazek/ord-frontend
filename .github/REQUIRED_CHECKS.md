# Required GitHub checks

After merging the E2E CI Phase 2 workflow, enable branch protection on `main`:

1. **Settings → Branches → Branch protection rules → `main`**
2. Enable **Require status checks to pass before merging**
3. Add these required checks:
   - `lint`
   - `format`
   - `types`
   - `e2e-types`
   - `build`
   - `unit-tests`
   - `audit`
   - `e2e`

The `e2e` job name matches the workflow job in [`.github/workflows/e2e.yml`](./workflows/e2e.yml).

## E2E backend image (GHCR)

CI pulls **`ghcr.io/kacper-ksiazek/ord-api:latest`** from GitHub Container Registry (same default as `ord-api/docker-compose.e2e.yml`). Each push to `ord-api` `main` republishes `latest` via [Publish ord-api to GHCR](https://github.com/Kacper-Ksiazek/ord-api/blob/main/.github/workflows/publish-ghcr.yml).

When `ord-api` changes the E2E runtime profile, OTP whitelist, or health check contract, merge to `ord-api` `main` and wait for that workflow before expecting frontend E2E to pass.

Local override:

```bash
ORD_API_IMAGE=ghcr.io/kacper-ksiazek/ord-api:sha-<commit> docker compose -f path/to/ord-api/docker-compose.e2e.yml up --wait
```
