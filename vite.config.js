import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import commonjs from '@rollup/plugin-commonjs';
import fs from 'fs/promises';
import path from 'path';

export default defineConfig({
  plugins: [
    sveltekit(),
    commonjs(),
    {
      name: 'custom-api',
      apply: 'build',
      configureServer(server) {
        server.middlewares.use('/api/posts', async (req, res, next) => {
          const postsDir = path.resolve(__dirname, '../harry-portofolio/src/routes/posts');
          const files = await fs.readdir(postsDir);

          const allPosts = await Promise.all(
            files
              .filter(file => file.endsWith('.html'))
              .map(async (file) => {
                const absolutePath = path.join(postsDir, file);
                const content = await fs.readFile(absolutePath, 'utf-8');
                const slug = path.basename(file, '.html');
                const htmlContent = content;

                return { slug, content: htmlContent };
              })
          );

          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ posts: allPosts }));
        });
      }
    }
  ],
  optimizeDeps: {
    include: ['@fortawesome/fontawesome-svg-core'],
  },
});