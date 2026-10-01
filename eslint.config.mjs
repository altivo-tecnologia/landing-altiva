import js from '@eslint/js';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier';
import astro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.astro/**', 'coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    files: ['scripts/**/*.{js,cjs,mjs}'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/*.{ts,cts,mts,astro}'],
    rules: { 'no-undef': 'off' },
  },
  {
    files: ['**/*.{astro,js,mjs,cjs,ts,cts,mts}'],
    linterOptions: {
      noInlineConfig: true,
      reportUnusedDisableDirectives: 'error',
    },
    rules: {
      'max-lines': ['error', { max: 300 }],
      'no-inline-comments': 'error',
      'no-warning-comments': ['error', { terms: ['TODO', 'FIXME', 'XXX'], location: 'anywhere' }],
    },
  },
  eslintConfigPrettier,
];
