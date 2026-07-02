# Component import convention — plan (FDD phase 1 follow-up)

> Temporary note. Captures review feedback from PR #17 and a proposed fix.
> Not implemented yet — revisit when polishing the component library structure.

## Review comment

Import convention inconsistency introduced by the refactor:

- `AppLogo` → deep `.svelte` path (bypassing the surviving barrel)
- `AuthUserAvatar` → flat root `.svelte`
- `Divider` → flat `utils/` `.svelte`

All three are trivial presentational wrappers. Pick one rule (direct `.svelte` for utils, barrel for families) and apply it — right now it reads like half-migrated FDD.

---

## Diagnosis

Three different conventions for simple wrappers:

| Component | Location | Import in code |
|-----------|----------|----------------|
| `AppLogo` | folder + barrel `index.ts` | deep path `.../app-logo/app-logo.svelte` — **barrel exists but is bypassed** |
| `AuthUserAvatar` | flat root `components/` | `.../auth-user-avatar.svelte` |
| `Divider` | flat `utils/` | `.../utils/divider.svelte` |

This is not a deliberate choice — it's an effect of partial FDD migration: barrels were removed for `divider`, `content-card`, `skeleton`, etc., but `app-logo` kept its folder + barrel, and auth components landed at the components root.

Secondary inconsistencies (same PR scope):

- `CircularProgressBar` imported via deep path, while `ScoreBox` uses the `scores/` barrel
- `Loader` inside `loader-screen` imported via deep path instead of from its barrel

---

## Recommended rule (single, simple)

> **Component family** (folder with types / stories / constants) → `index.ts` barrel; consumers always import from the barrel.
> **Leaf** (single `.svelte`, no companion types) → flat file; consumers import directly from `.svelte`.

Classification criterion:

```
Family  →  has *.types.ts OR *.constants.ts OR subcomponents
Leaf    →  only one .svelte file (+ optional story)
```

---

## Component classification

### Families (barrel, no deep `.svelte`)

- `buttons/*`
- `cards/*`
- `scores/*` (with `scores/index.ts` as family barrel)
- `utils/loader`, `utils/loader-screen`, `utils/status-screen`, `utils/multi-step-form`, `utils/page-content-container`, `utils/scrollable-wrapper`
- `app-logo/` — already a family; imports just need fixing

### Leaves (flat `.svelte`, direct import)

- `utils/divider.svelte`
- `utils/content-card.svelte`
- `utils/skeleton.svelte`
- `utils/selectable-card.svelte`
- `utils/text-with-three-dots-animation.svelte`
- `auth-user-avatar.svelte` → **move to `utils/`**
- `auth-user-native-language-flag.svelte` → **move to `utils/`**

Auth components at `components/` root have no justification — they are leaves and should live next to `divider` in `utils/`.

---

## Implementation plan (~1 commit, ~15 files)

### Step 1 — Unify `AppLogo` import

```ts
// before
import AppLogo from '$lib/components/app-logo/app-logo.svelte';

// after
import { AppLogo } from '$lib/components/app-logo';
```

Files: `sidebar.svelte`, `public-layout.svelte`, `login/+page.svelte`, `+error.svelte` (×2) — **5 places**

### Step 2 — Move auth leaves to `utils/`

```
auth-user-avatar.svelte               → utils/auth-user-avatar.svelte
auth-user-native-language-flag.svelte → utils/auth-user-native-language-flag.svelte
```

Update imports in: `sidebar.svelte`, `overview-tab.svelte`, `translation-block.svelte` — **3 places**

### Step 3 — Fix secondary deep imports in families

```ts
// loader-screen.svelte
import { Loader } from '$lib/components/utils/loader';

// overview-tab.svelte, circular-progress-bars.svelte
import { CircularProgressBar } from '$lib/components/scores';
// (add export in scores/circular-progress-bar/index.ts if missing,
//  or import from '$lib/components/scores/circular-progress-bar')
```

### Step 4 — Document the rule (optional)

Short paragraph in `docs/ai-rules/` or component README:

```
Families  → import { X } from '$lib/components/<category>/<name>'
Leaves    → import X from '$lib/components/utils/<name>.svelte'
```

### Step 5 — Verification

```bash
bun run check
bun run lint

# no deep .svelte imports for components that have a barrel
rg "app-logo/app-logo\.svelte" src/
rg "circular-progress-bar/circular-progress-bar\.svelte" src/
```

---

## Suggested PR review reply

> Adopted rule: **barrel for families, direct `.svelte` for leaf components**.
> `AppLogo` now imports from its existing barrel. Auth avatars moved to `utils/` alongside other leaves (`divider`, `content-card`). Deep `.svelte` bypasses for family members (`CircularProgressBar`, `Loader`) cleaned up.

---

## Out of scope (for this follow-up)

- Do **not** restore barrels for leaves (`divider`, `skeleton`, etc.) — that was an intentional FDD phase 1 step
- Do **not** reorganize `forms/`, `navigation/` — outside this comment's scope
- Do **not** change `scores/index.ts` to be the only entry point for everything (it already works for most score components)
