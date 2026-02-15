<script>
  import { onMount } from 'svelte';

  let posts = [];

  onMount(async () => {
    try {
      const response = await fetch('/api/posts');
      const data = await response.json();
      posts = data.posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  });
</script>

<svelte:head>
  <title>Learning Blog</title>
</svelte:head>

<main class="min-h-screen bg-gray-50 pt-20">
  <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <a 
      href="/" 
      class="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-8 transition-colors"
    >
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Home
    </a>

    <div class="text-center mb-12">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">Learning Blog</h1>
      <div class="w-20 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
      <p class="mt-4 text-gray-600">Thoughts on software development and technology</p>
    </div>
    
    {#if posts.length === 0}
      <div class="text-center py-12">
        <p class="text-gray-500">No posts yet. Check back soon!</p>
      </div>
    {:else}
      <div class="space-y-8">
        {#each posts as post}
          <article class="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            {@html post.content}
          </article>
        {/each}
      </div>
    {/if}
  </div>
</main>
