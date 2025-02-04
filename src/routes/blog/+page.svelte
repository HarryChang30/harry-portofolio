<script>
  import { onMount } from 'svelte';

  /** @type {Array<{slug: string, content: string}>} */
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

<main>
  <title>Learning Blog</title>
  <header class="bg-gray-800 text-white text-center py-6">
    <h1 class="text-3xl font-bold">Learning Blog</h1>
  </header>
  {#each posts as post}
    <div class="post-content">{@html post.content}</div>
  {/each}
  <footer class="bg-gray-800 text-white text-center py-6 cfooter">
    <p>&copy; 2025 Learning Blog</p>
  </footer>
</main>

<style>
  .post-content {
    white-space: wrap;
  }
</style>