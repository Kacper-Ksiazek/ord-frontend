# E2E journeys: enumerated `test.step` blocks

Every spec in `e2e/journeys/*.spec.ts` models **one user journey** as **one `test()`** (except `00-auth-journey`, which uses several serial tests for distinct auth scenarios). Inside that test, split the flow into **`await test.step(...)`** blocks so Playwright reports each phase in the HTML trace and failures point at a named step.

## Step labels

- Prefix with a **two-digit index** and a **period**: `'01. …'`, `'02. …'`, … `'10. …'`.
- Use **zero padding** for 01–09; continue with `10`, `11`, … when needed.
- Write labels in **English**, imperative or short phrase: what the user (or test) accomplishes in that block — not assertion jargon (`expect modal open`).
- **Renumber** when inserting or removing steps; keep the sequence contiguous within each `test()`.
- Each step should be **one coherent beat** (navigate + wait for screen, complete a wizard leg, send a message). Do not wrap every single `expect` in its own step.

## Structure

```ts
test('…', async ({ authenticatedPage }) => {
	const pageObject = create…(authenticatedPage);

	await test.step('01. …', async () => { … });
	await test.step('02. …', async () => { … });
});
```

- Create page objects **once** at the top of the test; steps call methods on them.
- Keep **constants** (`USER_MESSAGE`, filter strings) at module scope when shared across steps.
- **`test.beforeEach`** stays outside steps (skip guards, serial config).

## Good

```ts
test('feature happy path', async ({ authenticatedPage }) => {
	const listPage = createListPage(authenticatedPage);
	const featureModal = createFeatureModal(authenticatedPage);

	await test.step('01. Load list and apply a filter', async () => {
		await listPage.goto();
		await listPage.expectLoaded();
		await listPage.fillSearchFilter(LIST_FILTER);
		await expect(listPage.filterSearch).toHaveValue(LIST_FILTER);
	});

	await test.step('02. Open feature from sidebar', async () => {
		await featureModal.openFromSidebar();
		await featureModal.expectOpen();
		expect(new URL(authenticatedPage.url()).searchParams.get('search')).toBe(LIST_FILTER);
	});

	await test.step('03. Run primary action and wait for result', async () => {
		await featureModal.submitInput(PHRASE);
		const requestBody = await featureModal.waitForPrimaryResponse();
		expect(requestBody).toMatchObject({ phrase: PHRASE });
		await featureModal.expectResultVisible();
	});

	await test.step('04. Close without losing list state', async () => {
		await featureModal.close();
		await featureModal.expectClosed();
		await listPage.expectUrlFilters({ search: LIST_FILTER });
	});
});
```

## Bad

```ts
// Flat script — hard to read in trace and on failure
await list.goto();
await list.clickNew();
await create.completeSteps();

// Unnumbered or vague steps
await test.step('check stuff', async () => { … });
await test.step('step 3', async () => { … });

// One step for the entire journey
await test.step('full flow', async () => { /* 80 lines */ });
```
