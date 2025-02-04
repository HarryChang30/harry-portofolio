import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    const postsDir = path.resolve('../harry-portofolio/src/routes/posts'); // Your exact path
    const files = await fs.readdir(postsDir);

    const allPosts = await Promise.all(
      files
        .filter(file => file.endsWith('.html'))
        .map(async (file) => {
          const absolutePath = path.join(postsDir, file);
          const content = await fs.readFile(absolutePath, 'utf-8');
          const slug = path.basename(file, '.html');

          return { slug, content };
        })
    );

    return new Response(JSON.stringify({ posts: allPosts }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error reading posts:', error);
    return new Response(JSON.stringify({ error: 'Failed to load posts' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
