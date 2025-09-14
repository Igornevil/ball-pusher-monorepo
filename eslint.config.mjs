// eslint.config.mjs

import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  // ===== FRONTEND (без изменений) =====
  {
    files: ['packages/frontend/**/*.{ts,tsx,js,jsx}'],
    ignores: ['packages/frontend/dist/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: resolve(__dirname, 'packages/frontend/tsconfig.eslint.json'),
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },

  // ===== BACKEND (финальная, исправленная версия) =====
  {
    files: ['packages/backend/**/*.{ts,js}'],
    ignores: ['packages/backend/dist/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: resolve(__dirname, 'packages/backend/tsconfig.eslint.json'),
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: resolve(__dirname, 'packages/backend/tsconfig.json'),
        },
      },
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
  },
];
