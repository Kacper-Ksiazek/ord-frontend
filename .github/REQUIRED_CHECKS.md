# Required GitHub checks

After merging the E2E CI Phase 2 workflow, enable branch protection on `main`:

1. **Settings → Branches → Branch protection rules → `main`**
2. Enable **Require status checks to pass before merging**
3. Add these required checks:
   - `lint`
   - `format`
   - `types`
   - `build`
   - `unit-tests`
   - `e2e`

The `e2e` job name matches the workflow job in [`.github/workflows/e2e.yml`](./workflows/e2e.yml).

## Updating the pinned ord-api image

CI pulls a specific GHCR tag (`sha-<commit>`), not `latest`. When `ord-api` changes the E2E runtime profile, OTP whitelist, or health check contract:

1. Merge and publish the new `ord-api` image to GHCR (push to `ord-api` `main`).
2. Update [`.github/ord-api-e2e-image.sha`](./ord-api-e2e-image.sha) with the new commit SHA.
3. Open a frontend PR and verify the `e2e` check passes.

Local runs can override the image:

```bash
ORD_API_IMAGE=ghcr.io/kacper-ksiazek/ord-api:sha-<commit> docker compose -f path/to/ord-api/docker-compose.e2e.yml up --wait
```
