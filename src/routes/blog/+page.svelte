<script context="module" lang="ts">
    export async function load() {
      const posts = import.meta.glob('../posts/*.md');
      const iterablePosts = Object.entries(posts);
  
      const allPosts: (PostMetadata & { slug: string })[] = await Promise.all(
        iterablePosts.map(async ([path, resolver]) => {
          const postModule = (await resolver()) as { default: { metadata: PostMetadata } };
          const metadata = postModule.default.metadata;
          const slug = path.split('/').pop()?.replace('.md', '') || '';
          
          console.log('Loaded post:', { slug, metadata });
          
          return { slug, ...metadata };
        })
      );
  
      return { props: { posts: allPosts } };
    }
  </script>
  
  <script lang="ts">
    import Blog from '../../components/Blog.svelte';
    import type { PostMetadata } from '../../types';
  
    export let posts: (PostMetadata & { slug: string })[] = [];
  </script>
  
  <main class="flex">
    <section class="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-100 min-h-screen">
      <Blog {posts} />
    </section>
  </main>
  