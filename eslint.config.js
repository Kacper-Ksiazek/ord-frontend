import js from '@eslint/js';
import * as ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import tsParser from '@typescript-eslint/parser';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
	{
		ignores: [
			'node_modules/',
			'.svelte-kit/',
			'build/',
			'dist/',
			'coverage/',
			'.vercel/',
			'src/lib/paraglide/',
			'src/paraglide/',
			'storybook-static/'
		]
	},
	js.configs.recommended,
	...ts.configs.strict,
	...svelte.configs['flat/recommended'],
	...svelte.configs['flat/prettier'],
	{
		files: ['**/*.cjs'],
		languageOptions: {
			globals: {
				module: 'writable',
				require: 'readonly',
				exports: 'writable',
				__dirname: 'readonly',
				__filename: 'readonly',
				process: 'readonly'
			}
		}
	},
	{
		files: ['**/*.stories.svelte', '**/*.stories.ts'],
		rules: {
			'@typescript-eslint/no-explicit-any': 'off'
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelte.parser,
			parserOptions: {
				parser: ts.parser
			},
			globals: {
				console: 'readonly',
				localStorage: 'readonly',
				document: 'readonly',
				window: 'readonly',
				MouseEvent: 'readonly',
				HTMLButtonElement: 'readonly',
				HTMLDivElement: 'readonly',
				HTMLInputElement: 'readonly',
				HTMLTextAreaElement: 'readonly',
				HTMLElement: 'readonly',
				EventTarget: 'readonly',
				crypto: 'readonly',
				Event: 'readonly',
				KeyboardEvent: 'readonly',
				ClipboardEvent: 'readonly',
				FocusEvent: 'readonly',
				setTimeout: 'readonly',
				clearTimeout: 'readonly',
				alert: 'readonly',
				LucideIcon: 'readonly',
				TailwindColor: 'readonly',
				Percentage: 'readonly',
				TimeInMs: 'readonly'
			}
		},
		rules: {
			'svelte/no-navigation-without-resolve': 'off',
			'padding-line-between-statements': [
				'error',
				{
					blankLine: 'always',
					prev: '*',
					next: 'return'
				}
			]
		}
	},
	{
		files: ['**/*.svelte.ts', '**/*.svelte.js'],
		languageOptions: {
			parser: tsParser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: './tsconfig.json'
			}
		},
		plugins: {
			svelte: svelte
		},
		rules: {
			// Disable Svelte-specific rules for .svelte.ts files
			'svelte/no-at-html-tags': 'off',
			'svelte/valid-compile': 'off',
			'padding-line-between-statements': [
				'error',
				{
					blankLine: 'always',
					prev: '*',
					next: 'return'
				}
			]
		}
	},
	{
		files: ['**/*.ts', '**/*.js'],
		languageOptions: {
			globals: {
				console: 'readonly'
			}
		},
		rules: {
			'svelte/no-navigation-without-resolve': 'off',
			'padding-line-between-statements': [
				'error',
				{
					blankLine: 'always',
					prev: '*',
					next: 'return'
				}
			]
		}
	},
	{
		files: ['**/*.svelte', '**/*.ts', '**/*.js'],
		plugins: {
			'unused-imports': unusedImports
		},
		rules: {
			'@typescript-eslint/no-unused-vars': 'off',
			'unused-imports/no-unused-imports': 'error',
			'unused-imports/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			]
		}
	}
];
