import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import commonjs from '@rollup/plugin-commonjs'

export default defineConfig({
	plugins: [sveltekit(), commonjs()],
	optimizeDeps: {
		include: ['@fortawesome/fontawesome-svg-core'],
	  },
});
