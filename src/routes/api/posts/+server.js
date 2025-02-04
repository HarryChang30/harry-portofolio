// @ts-nocheck
export async function GET() {
    try {
      // Import all HTML files from `src/lib/posts/`
      const files = import.meta.glob('/src/lib/posts/*.html', { as: 'raw' });
  
      // Read file contents
      const allPosts = await Promise.all(
        Object.entries(files).map(async ([filePath, resolver]) => {
          const content = await resolver();
          const slug = filePath ? filePath.split('/').pop().replace('.html', '') : '';
          return { slug, content };
        })
      );
  
      return new Response(JSON.stringify({ posts: allPosts }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      console.error('Error reading posts:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }
  