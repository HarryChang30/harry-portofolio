<script lang="ts">
    import type { PostMetadata } from '../types';
  
    // Define the type of the posts prop, including the slug
    export let posts: (PostMetadata & { slug: string })[] = [];
  </script>
  
  <section class="max-w-3xl mx-auto p-4">
    <h1 class="text-4xl font-bold mb-6">Blog</h1>
  
    <div class="space-y-4">
      {#each posts as post}
        <a href={`/blog/${post.slug}`} class="block p-4 rounded-lg shadow-lg bg-white hover:bg-gray-100 transition">
          <h2 class="text-2xl font-semibold">{post.title}</h2>
          <p class="text-sm text-gray-500">{post.date} by {post.author}</p>
          {#if post.thumbnail}
            <img src={post.thumbnail} alt="{post.title} Thumbnail" class="rounded-lg mt-2" />
          {/if}
        </a>
      {/each}
    </div>
  </section>
  