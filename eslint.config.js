import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig([
  globalIgnores(['dist', 'node_modules']),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser } },
    rules: {
      "no-unused-vars": "error",
      "no-var": "error",
      "no-param-reassign": "error",
      "no-console": "warn",
      "prefer-const": "error"
    },
  },
  prettier,
]);