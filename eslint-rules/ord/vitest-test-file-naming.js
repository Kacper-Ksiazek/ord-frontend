import { existsSync } from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';

const SVELTE_BROWSER_TEST = /\.svelte\.(test|spec)\.(js|ts)$/;
const BLOCKED_BROWSER_TEST_DIRS = ['/stores/', '/guards/', '/utils/'];

/** @param {string} cwd @param {string} filename */
function normalizeRel(cwd, filename) {
	const rel = relative(cwd, filename).replace(/\\/g, '/');

	if (rel.startsWith('..')) {
		return null;
	}

	if (!rel.startsWith('src/')) {
		return null;
	}

	return rel;
}

/** @param {string} testFile */
function siblingComponentPath(testFile) {
	const dir = dirname(testFile);
	const base = basename(testFile).replace(/\.svelte\.(test|spec)\.(js|ts)$/, '');

	if (base.includes('..') || base.includes('/') || base.includes('\\')) {
		return null;
	}

	return join(dir, `${base}.svelte`);
}

/**
 * @param {string} cwd
 * @param {string} filename
 * @returns {{ messageId: string; data: Record<string, string> } | null}
 */
function validateBrowserTestFile(cwd, filename) {
	if (!SVELTE_BROWSER_TEST.test(filename)) {
		return null;
	}

	const rel = normalizeRel(cwd, filename);
	if (!rel) {
		return null;
	}

	if (BLOCKED_BROWSER_TEST_DIRS.some((segment) => rel.includes(segment))) {
		return {
			messageId: 'blockedDir',
			data: { rel }
		};
	}

	const componentPath = siblingComponentPath(filename);
	if (componentPath && existsSync(componentPath)) {
		return null;
	}

	const base = basename(filename).replace(/\.svelte\.(test|spec)\.(js|ts)$/, '');
	const dir = dirname(filename);
	const siblingSvelteTs = join(dir, `${base}.svelte.ts`);
	const siblingTs = join(dir, `${base}.ts`);

	if (existsSync(siblingSvelteTs)) {
		return {
			messageId: 'siblingSvelteTs',
			data: { rel, base, sibling: basename(siblingSvelteTs) }
		};
	}

	if (existsSync(siblingTs)) {
		return {
			messageId: 'siblingTs',
			data: { rel, base, sibling: basename(siblingTs) }
		};
	}

	return {
		messageId: 'noMatchingComponent',
		data: { rel, base }
	};
}

/** @type {import('eslint').Rule.RuleModule} */
export default {
	meta: {
		type: 'problem',
		docs: {
			description: 'Ensure *.svelte.test.ts files are only used for Svelte component browser tests'
		},
		schema: [],
		messages: {
			blockedDir:
				'{{rel}}: *.svelte.test.ts is for Svelte component browser tests only — use *.test.ts for stores, guards, and utils (Vitest server project).',
			siblingSvelteTs:
				'{{rel}}: rename to {{base}}.test.ts — {{sibling}} is a module/store, not a component; *.svelte.test.ts runs in the Vitest browser project (Playwright).',
			siblingTs:
				'{{rel}}: rename to {{base}}.test.ts — {{sibling}} is not a .svelte component; *.svelte.test.ts runs in the Vitest browser project (Playwright).',
			noMatchingComponent:
				'{{rel}}: *.svelte.test.ts requires a matching {{base}}.svelte component beside it, or use *.test.ts for node/server tests.'
		}
	},
	create(context) {
		const filename = context.filename ?? context.getFilename?.();
		if (!filename || filename.includes('node_modules')) {
			return {};
		}

		const issue = validateBrowserTestFile(context.cwd ?? process.cwd(), filename);
		if (!issue) {
			return {};
		}

		return {
			Program(node) {
				context.report({
					node,
					messageId: issue.messageId,
					data: issue.data
				});
			}
		};
	}
};
