import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  globalIgnores([
    '.next/**',
    'out/**',
    'build/**',
    'dist/**',
    'next-env.d.ts',
    // Legacy Vite entry files — kept only until the migration is reviewed,
    // then safe to delete (they are no longer imported anywhere).
    'index.html',
    'vite.config.js',
    'src/main.jsx',
    'src/App.jsx',
  ]),
]);

export default eslintConfig;
