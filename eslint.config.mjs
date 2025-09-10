// eslint.config.mjs
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default [
  // ===== FRONTEND =====
  {
    files: ['packages/frontend/**/*.{ts,tsx,js,jsx}'],
    ignores: ['packages/frontend/dist/**'], // игнорируем билд
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: resolve(__dirname, 'packages/frontend/tsconfig.eslint.json'), // теперь ESLint видит исходники
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
  // ===== BACKEND =====
  {
    files: ['packages/backend/**/*.{ts,js}'],
    ignores: ['packages/backend/dist/**'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: resolve(__dirname, 'packages/backend/tsconfig.json'),
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      // свои правила бэкенда
    },
  },
];
