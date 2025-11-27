import js from '@eslint/js';
import * as ts from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';

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
			'storybook-static/'
		]
	},
	js.configs.recommended,
	...ts.configs.strict,
	...svelte.configs['flat/recommended'],
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
				Event: 'readonly',
				KeyboardEvent: 'readonly',
				ClipboardEvent: 'readonly',
				FocusEvent: 'readonly',
				setTimeout: 'readonly',
				alert: 'readonly'
			}
		}
	},
	{
		files: ['**/*.ts', '**/*.js'],
		languageOptions: {
			globals: {
				console: 'readonly'
			}
		}
	}
];
