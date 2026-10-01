# E2E failure triage: verify the app manually before “fixing the test”

A failing journey often means **the product or stack is broken**, not that the spec is wrong. Agents must **not** spend multiple iterations tightening selectors, waits, or assertions until the human has confirmed the flow **works manually** (or confirmed it does not).

This complements [`e2e-app-bugs-block-tests.md`](e2e-app-bugs-block-tests.md) (no workarounds in specs).

**Dedicated agent:** main agents must delegate 1st/2nd failures to the triage workflow — [`e2e-triage-agent.md`](e2e-triage-agent.md) and `.cursor/skills/e2e-triage/SKILL.md`.

## Mandatory pause (first and second failure)

On the **first** failed E2E run for a given goal — and again on the **second** if still failing — the agent must **stop coding** and give the developer a **manual check** block before proposing more test changes:

1. **What to do in the browser** (URL, clicks, expected UI) — same path as the journey, not a shortcut.
2. **Stack** — e.g. `ord-ops make e2e-up`, frontend `make test-e2e` / dev URL from `.env.e2e` (`baseURL` must be a full URL, not invalid).
3. **Interpretation** — if manual repro **fails** → treat as **app/API bug**; fix product or backend stubs, do not encode failure in the test. If manual **passes** → investigate test env, timing, or page objects.

Do not assume “the test is wrong” by default.

## When to keep debugging the test (without manual block)

Only after the human confirms manual works **or** explicitly says “ignore manual, fix the test only”.

## Red flags (stop and report, do not patch the spec)

- Failure during **login / `page.goto`** (`invalid URL`, `/login` errors) → env/stack, not feature logic.
- Empty SSE / 200 with no body → backend stub or API bug (see ord-api), not “wait longer” in the spec.
- Passes after `reload`, `goto` bypass, or API seed → app bug; see `e2e-app-bugs-block-tests.md`.

## Good

```
After 05-explain-phrase failed on follow-up:

> Manual check (please do this before I change the spec again):
> 1. e2e stack up, open /conversations?modal=explain, explain “audacity”.
> 2. Click “More examples” — do new examples appear within ~10s?
> If not, this is likely API/stub or app — I won’t add waits to the journey until that’s fixed.
```

## Bad

```
// Three commits tweaking waitForResponse, response.text(), and selectors
// without ever asking the user to reproduce in the browser
```
