import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs/promises';
import path from 'path';

export default defineConfig({
  plugins: [
    sveltekit(),
    commonjs({
      include: ['node_modules/**'],
    }),
  ],
  optimizeDeps: {
    include: ['@fortawesome/fontawesome-svg-core'],
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
  },
});