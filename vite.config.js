import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs/promises';
import path from 'path';

export default defineConfig({
  plugins: [
    sveltekit(),
    commonjs(),
  ],
  optimizeDeps: {
    include: ['@fortawesome/fontawesome-svg-core'],
  },
});